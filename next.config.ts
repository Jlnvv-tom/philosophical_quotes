import path from "node:path";
import type { NextConfig } from "next";

// 部署到子路径时（如 GitHub Pages 项目页 https://<user>.github.io/<repo>/）由 CI 注入，
// 形如 "/philosophical_quotes"；留空或 "/" 则不启用
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const basePath =
  rawBasePath && rawBasePath !== "/" ? rawBasePath.replace(/\/$/, "") : undefined;

const nextConfig: NextConfig = {
  basePath,
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
