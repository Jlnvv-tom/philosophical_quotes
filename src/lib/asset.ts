/**
 * public/ 下的静态资源不会自动带 basePath（部署到 GitHub Pages 项目页时需要），
 * 这里统一补上前缀。构建期内联，运行时无额外开销。
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export function assetPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}
