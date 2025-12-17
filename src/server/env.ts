import {z} from 'zod';

const OptionalUrl = z
  .string()
  .optional()
  .transform((v) => (v && v.trim() ? v.trim() : undefined))
  .pipe(z.string().url().optional());

const UploadsEnvSchema = z.object({
  APP_BASE_URL: OptionalUrl
});

const EvolinkGenerationEnvSchema = z.object({
  EVOLINK_API_KEY: z.string().min(1),
  APP_BASE_URL: OptionalUrl
});

const EvolinkWebhookEnvSchema = z.object({
  WEBHOOK_SECRET: z.string().min(8)
});

export function getUploadsEnv() {
  const parsed = UploadsEnvSchema.safeParse(process.env);
  if (!parsed.success) return {APP_BASE_URL: undefined as string | undefined};
  return parsed.data;
}

export function getEvolinkGenerationEnv() {
  const parsed = EvolinkGenerationEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`环境变量缺失或非法：\n${issues}\n\n请参考 .env.example 配置 .env.local`);
  }
  return {
    EVOLINK_API_KEY: parsed.data.EVOLINK_API_KEY,
    APP_BASE_URL: parsed.data.APP_BASE_URL ? parsed.data.APP_BASE_URL.replace(/\/$/, '') : undefined
  };
}

export function getBaseUrlFromRequest(request: Request) {
  const {APP_BASE_URL} = getUploadsEnv();
  const base = APP_BASE_URL ?? new URL(request.url).origin;
  return base.replace(/\/$/, '');
}

export function getEvolinkWebhookSecret() {
  const parsed = EvolinkWebhookEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error('WEBHOOK_SECRET 未配置或太短，请在 .env.local 中设置（参考 .env.example）。');
  }
  return parsed.data.WEBHOOK_SECRET;
}
