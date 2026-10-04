"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";

import { QuoteCard } from "./quote-card";
import { philosopherBySlug, philosophers, quotes, themes } from "@/data";
import { cn } from "@/lib/utils";

type TraditionFilter = "all" | "cn" | "west";

const TRADITIONS: { key: TraditionFilter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "cn", label: "中国" },
  { key: "west", label: "西方" },
];

export function QuoteBrowser() {
  const [keyword, setKeyword] = useState("");
  const [tradition, setTradition] = useState<TraditionFilter>("all");
  const [theme, setTheme] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /** 键盘：/ 聚焦搜索，Esc 清空并失焦 */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      const typing =
        !!el &&
        (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "Escape" && typing) {
        setKeyword("");
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    return quotes.filter((q) => {
      if (theme && !q.themes.includes(theme)) return false;
      const author = philosopherBySlug.get(q.author);
      if (tradition !== "all" && author?.tradition !== tradition) return false;
      if (!k) return true;
      const themeNames = q.themes
        .map((s) => themes.find((t) => t.slug === s)?.name ?? "")
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
  }, [keyword, tradition, theme]);

  const dirty = keyword !== "" || tradition !== "all" || theme !== null;

  function reset() {
    setKeyword("");
    setTradition("all");
    setTheme(null);
  }

  return (
    <div>
      {/* ── 控制区 ── */}
      <div className="border-b border-line-soft pb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="group relative flex h-11 w-full items-center rounded-full border border-line bg-surface pl-4 pr-2 transition-colors focus-within:border-accent/50 lg:max-w-sm">
            <Search className="h-4 w-4 shrink-0 text-ink-faint" strokeWidth={1.4} />
            <input
              ref={inputRef}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索语句、哲人、学派或出处……"
              aria-label="搜索引文"
              className="h-full w-full bg-transparent px-3 font-sans text-sm text-ink outline-none placeholder:text-ink-faint"
            />
            {keyword ? (
              <button
                type="button"
                onClick={() => setKeyword("")}
                aria-label="清空搜索"
                className="focus-ring grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-faint transition-colors hover:text-ink"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.6} />
              </button>
            ) : (
              <kbd className="mr-1 hidden shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[0.625rem] text-ink-faint sm:block">
                /
              </kbd>
            )}
          </label>

          <div className="flex items-center gap-3">
            <div className="flex rounded-full border border-line bg-surface p-0.5">
              {TRADITIONS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTradition(t.key)}
                  className={cn(
                    "focus-ring rounded-full px-3.5 py-1.5 font-sans text-2xs tracking-wide transition-colors duration-300",
                    tradition === t.key
                      ? "bg-ink text-paper"
                      : "text-ink-muted hover:text-ink",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {dirty && (
              <button
                type="button"
                onClick={reset}
                className="focus-ring rounded-full font-sans text-2xs text-ink-faint underline decoration-line underline-offset-4 transition-colors hover:text-accent"
              >
                重置
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {themes.map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => setTheme((prev) => (prev === t.slug ? null : t.slug))}
              className={cn(
                "focus-ring rounded-full border px-3 py-1 font-sans text-2xs transition-colors duration-300",
                theme === t.slug
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-line text-ink-muted hover:border-ink-faint hover:text-ink",
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── 结果计数 ── */}
      <div className="flex items-baseline justify-between gap-4 py-6">
        <p className="font-sans text-2xs tracking-wider text-ink-faint">
          共 <span className="font-mono tabular-nums text-ink">{results.length}</span> 则
          {theme && (
            <>
              {" · "}
              {themes.find((t) => t.slug === theme)?.name}
            </>
          )}
        </p>
        <p className="font-sans text-2xs text-ink-faint">
          {philosophers.length} 位哲人 · {quotes.length} 则引文
        </p>
      </div>

      {/* ── 结果 ── */}
      {results.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((q) => (
            <QuoteCard key={q.id} quote={q} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-line py-24 text-center">
          <p className="font-serif text-lg text-ink-soft">没有找到相符的语句</p>
          <p className="mt-3 font-sans text-xs leading-6 text-ink-faint">
            可以试试更短的词，或者「生死」这样的主题、「斯多葛」「存在主义」这样的学派。
            <br className="hidden sm:block" />
            <button
              type="button"
              onClick={reset}
              className="focus-ring ml-1 text-accent underline decoration-accent/30 underline-offset-4"
            >
              清除筛选
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
