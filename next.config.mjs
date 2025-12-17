import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 防止 `next dev` 与 `next build` 共享同一个 `.next` 目录导致 chunk 丢失/500
  // 通过 npm scripts 注入 NEXT_DIST_DIR：dev 用 `.next-dev`，build/start 用 `.next-build`
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    remotePatterns: [
      {protocol: 'https', hostname: 'images.unsplash.com'},
      {protocol: 'https', hostname: 'api.evolink.ai'}
    ]
  }
};

export default withNextIntl(nextConfig);
