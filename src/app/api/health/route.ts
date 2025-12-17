import {NextResponse} from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    ok: true,
    env: {
      hasBlobToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      hasPostgresUrl: Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL),
      hasEvolinkKey: Boolean(process.env.EVOLINK_API_KEY),
      hasWebhookSecret: Boolean(process.env.WEBHOOK_SECRET)
    }
  });
}
