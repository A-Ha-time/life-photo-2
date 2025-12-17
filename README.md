# LUMINA STUDIO - Next.js 产品版

这是基于原型落地的 Next.js 网站产品版本，包含：

- 多语言切换：默认英文，可切换中文/韩语/日语
- 上传照片 + 场景选择 + 生成（Nano Banana Pro / Evolink）
- 生成结果预览、下载、分享、收藏
- 个人中心：我的作品/收藏（匿名用户以 `uid` Cookie 标识）
- 隐私与服务条款页面

原始静态原型已移动到 `prototype/` 目录，仅作为参考。

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 常见问题

- 如果出现页面 500 且报错类似 `Cannot find module './xxx.js'`（Next dev chunk 丢失），执行 `npm run clean` 后重启 `npm run dev`。
- 本项目将 `next dev` 输出目录单独设为 `.next-dev`（`NEXT_DIST_DIR`），避免与生产构建 `.next` 互相覆盖导致 500。

## 环境变量

复制 `.env.example` 为 `.env.local`，并填写：

- `EVOLINK_API_KEY`：你的 Banana Pro / Evolink API Key（仅服务端使用，不会暴露到前端）
- `BLOB_READ_WRITE_TOKEN`：Vercel Blob 读写 Token（用于上传）
- `POSTGRES_URL`：Vercel Postgres 连接串（用于保存任务/作品/收藏）
- `APP_BASE_URL`（可选）：站点公网域名（建议 `https://xxx.vercel.app` 或自定义域名）
- `WEBHOOK_SECRET`（推荐）：Webhook 校验密钥（>=8 位）

注意：Evolink 需要能直接访问你提供的参考图 URL；因此上传使用 Vercel Blob（公网 https）。本地开发如果想启用 webhook 回调，需要把本机暴露为 `https://` 域名并写入 `APP_BASE_URL`，否则会自动关闭 webhook、仅通过任务轮询获取结果。

## 部署到 Vercel

1. 在 Vercel 导入该项目
2. 在项目中启用：
   - Storage → Blob（会生成 `BLOB_READ_WRITE_TOKEN`）
   - Storage → Postgres（会生成 `POSTGRES_URL` 等）
3. 在 Environment Variables 中新增：
   - `EVOLINK_API_KEY`
   - `WEBHOOK_SECRET`（推荐）
   - `APP_BASE_URL`（可选，建议填生产域名）
4. 部署后打开站点即可验证：上传 → 选择场景 → 生成 → 预览/下载/分享

## 目录结构（关键）

- `src/app/[locale]/(site)/home`：首页
- `src/app/[locale]/(site)/create`：创作中心（上传/选场景/生成/预览）
- `src/app/[locale]/(site)/profile`：个人中心（作品/收藏）
- `src/app/[locale]/(site)/privacy`：隐私与协议
- `src/app/api/*`：上传、生成、任务查询、Webhook、收藏等 API
- Vercel 版本使用 Blob + Postgres，不再依赖本地落盘与 SQLite
