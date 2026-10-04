import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 稳定字符串哈希 —— 用于每日一言等"确定性随机"场景 */
export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 按日期取模，保证同一天所有访问者看到同一则 */
export function dailyIndex(length: number, date = new Date()): number {
  if (length <= 0) return 0;
  const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  return hashString(key) % length;
}

export function formatDateCN(value: string): string {
  const [y, m, d] = value.split("-");
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`;
}
