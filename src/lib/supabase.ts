import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * 构建时注入的 Supabase 配置是否存在。
 * 不存在时整站退化为纯静态阅读站：不渲染登录入口与互动按钮之外的任何请求。
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/**
 * 浏览器端单例。本站为纯静态导出、没有服务端，
 * 所有 Supabase 调用都发生在客户端；延迟初始化避免在 SSG 阶段触碰浏览器存储。
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured || typeof window === "undefined") return null;
  if (!client) {
    client = createClient(url as string, anonKey as string);
  }
  return client;
}
