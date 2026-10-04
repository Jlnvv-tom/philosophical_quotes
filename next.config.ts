import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 纯静态导出：`pnpm build` 后产物在 out/，可直接双击或用任意静态服务器托管
  output: "export",
  trailingSlash: true,
  // 上级目录存在其它 lockfile 时，显式固定工作区根，避免推断错误
  outputFileTracingRoot: path.join(__dirname),
  // 构建缓存目录，可用环境变量覆盖（默认 .next）
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
