import {NextResponse} from 'next/server';
import {z} from 'zod';
import {put} from '@vercel/blob';

import {getUserId} from '@/server/user';
import {ensureSchema, sql} from '@/server/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const UploadSchema = z.object({
  kind: z.enum(['front', 'side', 'full', 'ref'])
});

const MAX_BYTES = 10 * 1024 * 1024;

function isUploadFileLike(value: unknown): value is {
  arrayBuffer: () => Promise<ArrayBuffer>;
  type: string;
  size: number;
  name?: string;
} {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.arrayBuffer === 'function' &&
    typeof v.type === 'string' &&
    typeof v.size === 'number'
  );
}

export async function GET() {
  // 用于部署自检：如果这里返回 404，说明 Vercel 没有把 Next 作为 Serverless 部署（多半是静态输出配置错误）
  return NextResponse.json({ok: true, route: '/api/uploads'});
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({error: '缺少用户标识（uid）'}, {status: 401});
  }

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {error: '未配置 BLOB_READ_WRITE_TOKEN（请在 Vercel Storage→Blob 启用并注入环境变量）'},
        {status: 500}
      );
    }

    const form = await request.formData();
    const file = form.get('file');
    const kind = form.get('kind');

    const parsed = UploadSchema.safeParse({kind});
    if (!parsed.success) {
      return NextResponse.json({error: '参数错误', details: parsed.error.issues}, {status: 400});
    }

    // 注意：不同 Node.js 版本/运行时中 `File` 全局可能不存在（例如部分 Node 18 环境）。
    // 这里用“类 File”特征判断，避免 `ReferenceError: File is not defined`。
    if (!isUploadFileLike(file)) {
      return NextResponse.json({error: '缺少文件'}, {status: 400});
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({error: '仅支持图片文件'}, {status: 400});
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({error: '图片大小不能超过 10MB'}, {status: 413});
    }

    await ensureSchema();

    const id = crypto.randomUUID();
    const safeName =
      typeof file.name === 'string' && file.name.trim()
        ? file.name.trim()
        : 'upload.png';
    const pathname = `uploads/${userId}/${id}-${safeName.replace(/[^a-zA-Z0-9._-]+/g, '-')}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const uploaded = await put(pathname, bytes, {
      access: 'public',
      contentType: file.type
    });

    await sql`
      INSERT INTO uploads (id, user_id, kind, url, mime, size)
      VALUES (${id}, ${userId}, ${parsed.data.kind}, ${uploaded.url}, ${file.type}, ${file.size})
    `;

    return NextResponse.json({id, url: uploaded.url});
  } catch (e) {
    return NextResponse.json(
      {error: e instanceof Error ? e.message : '上传失败（服务器错误）'},
      {status: 500}
    );
  }
}
