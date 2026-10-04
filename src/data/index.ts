import { philosophers, philosopherBySlug, traditions } from "./philosophers";
import { quotes, quoteByAuthor, quoteByTheme, quoteById } from "./quotes";
import { themes, themeBySlug } from "./themes";

export type { Philosopher, Quote, Theme, Tradition } from "./types";

export {
  philosophers,
  philosopherBySlug,
  traditions,
  quotes,
  quoteByAuthor,
  quoteByTheme,
  quoteById,
  themes,
  themeBySlug,
};

/** 每个主题的引文数量 */
export const themeCounts: Record<string, number> = Object.fromEntries(
  themes.map((t) => [t.slug, quoteByTheme(t.slug).length]),
);

/** 每位哲学家的引文数量 */
export const authorCounts: Record<string, number> = Object.fromEntries(
  philosophers.map((p) => [p.slug, quoteByAuthor(p.slug).length]),
);

/** 按引文数量排序的哲学家（用于首页"群像"） */
export const philosophersByVolume = [...philosophers].sort(
  (a, b) => (authorCounts[b.slug] ?? 0) - (authorCounts[a.slug] ?? 0),
);

/** 全部学派，按出现顺序去重 */
export const schools = Array.from(new Set(philosophers.map((p) => p.school)));

/** 全部时代，按传统分组后去重 */
export const eras = Array.from(new Set(philosophers.map((p) => p.era)));

export const stats = {
  quotes: quotes.length,
  philosophers: philosophers.length,
  themes: themes.length,
  cn: philosophers.filter((p) => p.tradition === "cn").length,
  west: philosophers.filter((p) => p.tradition === "west").length,
};

/** 站内检索：在引文正文、作者名、学派、时代、出处、主题名上做朴素包含匹配 */
export function searchQuotes(keyword: string): typeof quotes {
  const k = keyword.trim().toLowerCase();
  if (!k) return quotes;
  return quotes.filter((q) => {
    const author = philosopherBySlug.get(q.author);
    const themeNames = q.themes
      .map((s) => themeBySlug.get(s)?.name ?? "")
      .join(" ");
    return [
      q.text,
      q.source,
      author?.name ?? "",
      author?.nameOriginal ?? "",
      author?.school ?? "",
      author?.era ?? "",
      themeNames,
    ]
      .join(" ")
      .toLowerCase()
      .includes(k);
  });
}
