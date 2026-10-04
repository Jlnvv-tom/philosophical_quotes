"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Check, RefreshCw, Shuffle } from "lucide-react";

import { philosopherBySlug, quotes, themeBySlug } from "@/data";
import { cn } from "@/lib/utils";

export function FeaturedQuote({ initialIndex }: { initialIndex: number }) {
  const [index, setIndex] = useState(initialIndex);
  const [copied, setCopied] = useState(false);

  const quote = quotes[index];
  const author = philosopherBySlug.get(quote.author);

  const reroll = useCallback(() => {
    setCopied(false);
    setIndex((prev) => {
      if (quotes.length <= 1) return prev;
      let next = prev;
      while (next === prev) {
        next = Math.floor(Math.random() * quotes.length);
      }
      return next;
    });
  }, []);

  const copy = useCallback(async () => {
    const payload = `「${quote.text}」\n—— ${author?.name ?? ""} ${quote.source}`;
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 剪贴板不可用时静默失败 */
    }
  }, [quote, author]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line-soft bg-surface p-8 shadow-card sm:p-12">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      <div className="flex items-center justify-between gap-4">
        <span className="eyebrow">今日一则</span>
        <span className="font-mono text-2xs tabular-nums text-ink-faint">
          {String(index + 1).padStart(3, "0")} / {quotes.length}
        </span>
      </div>

      <blockquote
        key={quote.id}
        className="animate-fade-up mt-8 text-balance font-serif text-xl leading-[1.9] text-ink sm:text-2xl sm:leading-[1.95]"
      >
        {quote.text}
      </blockquote>

      <div className="mt-9 flex flex-wrap items-center justify-between gap-5 border-t border-line-soft pt-6">
        <div>
          <Link
            href={`/philosophers/${author?.slug ?? ""}/`}
            className="focus-ring rounded-sm font-serif text-sm text-ink transition-colors hover:text-accent"
          >
            {author?.name}
          </Link>
          <span className="mt-1 block font-sans text-2xs leading-4 text-ink-faint">
            {quote.source}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {quote.themes.slice(0, 2).map((slug) => {
            const theme = themeBySlug.get(slug);
            if (!theme) return null;
            return (
              <Link
                key={slug}
                href={`/themes/${slug}/`}
                className="focus-ring rounded-full border border-line px-2.5 py-1 font-sans text-2xs text-ink-muted transition-colors hover:border-accent/40 hover:text-accent"
              >
                {theme.name}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={copy}
            className={cn(
              "focus-ring inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans text-2xs transition-colors",
              copied
                ? "border-jade/40 text-jade"
                : "border-line text-ink-muted hover:border-accent/40 hover:text-accent",
            )}
          >
            {copied ? (
              <Check className="h-3 w-3" strokeWidth={1.6} />
            ) : (
              <Shuffle className="h-3 w-3" strokeWidth={1.6} />
            )}
            {copied ? "已复制" : "复制"}
          </button>
          <button
            type="button"
            onClick={reroll}
            className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-sans text-2xs text-ink-muted transition-colors hover:border-accent/40 hover:text-accent"
          >
            <RefreshCw className="h-3 w-3" strokeWidth={1.6} />
            换一则
          </button>
        </div>
      </div>
    </div>
  );
}
