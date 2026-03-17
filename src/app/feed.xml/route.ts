import {getGuides} from '@/lib/guides';
import {getLocalizedUrl, getSiteUrl} from '@/lib/seo';

export const revalidate = 3600;

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const feedUrl = `${siteUrl}/feed.xml`;
  const guides = getGuides('en');

  const items = guides
    .map((guide) => {
      const guideUrl = getLocalizedUrl('en', `/guides/${guide.slug}`);
      const pubDate = new Date(`${guide.updatedAt}T00:00:00.000Z`).toUTCString();

      return [
        '<item>',
        `<title>${escapeXml(guide.copy.title)}</title>`,
        `<link>${escapeXml(guideUrl)}</link>`,
        `<guid isPermaLink="true">${escapeXml(guideUrl)}</guid>`,
        `<description>${escapeXml(guide.copy.description)}</description>`,
        `<pubDate>${pubDate}</pubDate>`,
        '</item>'
      ].join('');
    })
    .join('');

  const newest = guides
    .map((guide) => new Date(`${guide.updatedAt}T00:00:00.000Z`).getTime())
    .reduce((max, current) => Math.max(max, current), Date.now());
  const lastBuildDate = new Date(newest).toUTCString();

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    '<title>LUMINA STUDIO Guides</title>',
    `<link>${escapeXml(siteUrl)}</link>`,
    '<description>Latest practical guides from LUMINA STUDIO.</description>',
    '<language>en-us</language>',
    `<atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    `<lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    items,
    '</channel>',
    '</rss>'
  ].join('');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}
