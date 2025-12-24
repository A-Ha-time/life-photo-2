import 'server-only';

import {sql} from './db';

export const INITIAL_CREDITS = 30;
export const DAILY_CREDITS = 10;
export const COST_2K = 3;
export const COST_4K = 9;

export type CreditSummary = {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  lastDailyGrant: string | null;
};

export async function ensureCreditRow(userId: string) {
  await sql`
    INSERT INTO user_credits (user_id, balance, total_earned, total_spent, last_daily_grant)
    VALUES (${userId}, ${INITIAL_CREDITS}, ${INITIAL_CREDITS}, 0, CURRENT_DATE)
    ON CONFLICT (user_id) DO NOTHING
  `;

  await sql`
    INSERT INTO credit_events (id, user_id, amount, type, reason)
    SELECT ${crypto.randomUUID()}, ${userId}, ${INITIAL_CREDITS}, 'grant', 'initial'
    WHERE NOT EXISTS (SELECT 1 FROM credit_events WHERE user_id = ${userId} AND reason = 'initial')
  `;
}

export async function grantDailyCredits(userId: string) {
  const res = await sql<{last_daily_grant: string | null}>`
    SELECT last_daily_grant::text AS last_daily_grant
    FROM user_credits
    WHERE user_id = ${userId}
    LIMIT 1
  `;
  const last = res.rows[0]?.last_daily_grant ?? null;
  if (last === null) return;

  const grantRes = await sql`
    UPDATE user_credits
    SET balance = balance + ${DAILY_CREDITS},
        total_earned = total_earned + ${DAILY_CREDITS},
        last_daily_grant = CURRENT_DATE,
        updated_at = NOW()
    WHERE user_id = ${userId}
      AND last_daily_grant < CURRENT_DATE
    RETURNING user_id
  `;

  if (grantRes.rows.length > 0) {
    await sql`
      INSERT INTO credit_events (id, user_id, amount, type, reason)
      VALUES (${crypto.randomUUID()}, ${userId}, ${DAILY_CREDITS}, 'grant', 'daily')
    `;
  }
}

export async function getCredits(userId: string): Promise<CreditSummary> {
  await ensureCreditRow(userId);
  await grantDailyCredits(userId);
  const res = await sql<{
    balance: number;
    total_earned: number;
    total_spent: number;
    last_daily_grant: string | null;
  }>`
    SELECT balance, total_earned, total_spent, last_daily_grant::text AS last_daily_grant
    FROM user_credits
    WHERE user_id = ${userId}
    LIMIT 1
  `;
  const row = res.rows[0];
  return {
    balance: row?.balance ?? 0,
    totalEarned: row?.total_earned ?? 0,
    totalSpent: row?.total_spent ?? 0,
    lastDailyGrant: row?.last_daily_grant ?? null
  };
}

export async function trySpendCredits(userId: string, amount: number, reason: string, taskId: string | null) {
  const spendRes = await sql`
    UPDATE user_credits
    SET balance = balance - ${amount},
        total_spent = total_spent + ${amount},
        updated_at = NOW()
    WHERE user_id = ${userId}
      AND balance >= ${amount}
    RETURNING balance
  `;
  if (spendRes.rows.length === 0) return false;

  await sql`
    INSERT INTO credit_events (id, user_id, amount, type, reason, task_id)
    VALUES (${crypto.randomUUID()}, ${userId}, ${-amount}, 'debit', ${reason}, ${taskId})
  `;
  return true;
}

export async function refundCredits(userId: string, amount: number, reason: string, taskId: string | null) {
  await sql`
    UPDATE user_credits
    SET balance = balance + ${amount},
        total_spent = total_spent - ${amount},
        updated_at = NOW()
    WHERE user_id = ${userId}
  `;
  await sql`
    INSERT INTO credit_events (id, user_id, amount, type, reason, task_id)
    VALUES (${crypto.randomUUID()}, ${userId}, ${amount}, 'refund', ${reason}, ${taskId})
  `;
}
