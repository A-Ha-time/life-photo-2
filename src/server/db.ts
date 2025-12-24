import {Pool} from 'pg';

let didInit = false;
let pool: Pool | null = null;

function getConnectionString() {
  const cs =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.PRISMA_DATABASE_URL;
  if (!cs) {
    throw new Error(
      'Missing Postgres connection string. Please set POSTGRES_URL (or DATABASE_URL/PRISMA_DATABASE_URL) to a pooled connection string.'
    );
  }
  return cs;
}

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: getConnectionString(),
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      ssl: {rejectUnauthorized: false}
    });
  }
  return pool;
}

type SqlResult<T = any> = {rows: T[]};

export async function sql<T = any>(
  strings: TemplateStringsArray,
  ...values: any[]
): Promise<SqlResult<T>> {
  let text = '';
  for (let i = 0; i < strings.length; i++) {
    text += strings[i];
    if (i < values.length) {
      text += `$${i + 1}`;
    }
  }
  const result = await getPool().query(text, values);
  return {rows: result.rows as T[]};
}

export async function ensureSchema() {
  if (didInit) return;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS preferences (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      locale TEXT NOT NULL DEFAULT 'en',
      default_size TEXT NOT NULL DEFAULT '1:1',
      default_quality TEXT NOT NULL DEFAULT '2K',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      display_name TEXT NOT NULL DEFAULT 'Guest',
      email TEXT,
      avatar_url TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS uploads (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      kind TEXT NOT NULL,
      url TEXT NOT NULL,
      mime TEXT NOT NULL,
      size INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS generation_tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      scene_id TEXT NOT NULL,
      status TEXT NOT NULL,
      progress INTEGER NOT NULL DEFAULT 0,
      model TEXT NOT NULL,
      prompt TEXT NOT NULL,
      size TEXT NOT NULL,
      quality TEXT NOT NULL,
      request_json JSONB NOT NULL,
      response_json JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE generation_tasks ADD COLUMN IF NOT EXISTS credits_cost INTEGER NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE generation_tasks ADD COLUMN IF NOT EXISTS credits_refunded BOOLEAN NOT NULL DEFAULT FALSE`;

  await sql`
    CREATE TABLE IF NOT EXISTS images (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL REFERENCES generation_tasks(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`CREATE UNIQUE INDEX IF NOT EXISTS images_task_url_unique ON images(task_id, url)`;

  await sql`
    CREATE TABLE IF NOT EXISTS favorites (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      image_id TEXT NOT NULL REFERENCES images(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, image_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS user_credits (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      balance INTEGER NOT NULL DEFAULT 0,
      total_earned INTEGER NOT NULL DEFAULT 0,
      total_spent INTEGER NOT NULL DEFAULT 0,
      last_daily_grant DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS credit_events (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL,
      reason TEXT,
      task_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  didInit = true;
}
