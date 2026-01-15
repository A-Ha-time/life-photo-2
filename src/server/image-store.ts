import {put} from '@vercel/blob';

import {ensureSchema, sql} from './db';

const IMAGE_EXT_RE = /\.(png|jpe?g|webp)(\?|$)/i;

function looksLikeImageUrl(url: string) {
  return IMAGE_EXT_RE.test(url);
}

async function fetchImageBytes(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const resp = await fetch(url, {signal: controller.signal});
    if (!resp.ok) return null;
    const contentType = resp.headers.get('content-type') ?? '';
    if (!contentType.startsWith('image/')) return null;
    const arrayBuffer = await resp.arrayBuffer();
    return {bytes: Buffer.from(arrayBuffer), contentType};
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function extFromContentType(contentType: string) {
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg';
  return 'png';
}

export async function persistGeneratedImages(options: {
  taskId: string;
  userId: string;
  urls: string[];
  inputUrls?: Set<string>;
}) {
  const {taskId, userId, urls, inputUrls} = options;
  if (!urls.length) return;

  await ensureSchema();
  const existingRes = await sql<{n: number}>`
    SELECT COUNT(*)::int AS n FROM images WHERE task_id = ${taskId}
  `;
  const existing = existingRes.rows[0]?.n ?? 0;
  if (existing > 0) return;

  const filtered = urls.filter((u) => /^https?:\/\//i.test(u) && !(inputUrls?.has(u)));
  if (filtered.length === 0) return;

  const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  const storedUrls: string[] = [];

  if (hasBlobToken) {
    for (const url of filtered) {
      if (!looksLikeImageUrl(url)) {
        const fetched = await fetchImageBytes(url);
        if (!fetched) continue;
        const ext = extFromContentType(fetched.contentType);
        const pathname = `generated/${userId}/${taskId}-${crypto.randomUUID()}.${ext}`;
        const uploaded = await put(pathname, fetched.bytes, {
          access: 'public',
          contentType: fetched.contentType
        });
        storedUrls.push(uploaded.url);
        continue;
      }

      const fetched = await fetchImageBytes(url);
      if (!fetched) continue;
      const ext = extFromContentType(fetched.contentType);
      const pathname = `generated/${userId}/${taskId}-${crypto.randomUUID()}.${ext}`;
      const uploaded = await put(pathname, fetched.bytes, {
        access: 'public',
        contentType: fetched.contentType
      });
      storedUrls.push(uploaded.url);
    }
  }

  const finalUrls = storedUrls.length > 0 ? storedUrls : filtered;
  for (const u of finalUrls) {
    await sql`
      INSERT INTO images (id, task_id, url)
      VALUES (${crypto.randomUUID()}, ${taskId}, ${u})
      ON CONFLICT (task_id, url) DO NOTHING
    `;
  }
}
