"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { RefreshCw } from "lucide-react";

import { philosopherBySlug, quotes, themeBySlug } from "@/data";

export function RandomQuote({ initialIndex }: { initialIndex: number }) {
  const [index, setIndex] = useState(initialIndex);
  const quote = quotes[index];
  const author = philosopherBySlug.get(quote.author);

  const reroll = useCallback(() => {
    setIndex((prev) => {
      if (quotes.length <= 1) return prev;
      let next = prev;
      while (next === prev) next = Math.floor(Math.random() * quotes.length);
      return next;
    });
  }, []);

  return (
    <div className="flex min-h-[62vh] flex-col items-center justify-center py-16 text-center">
      <span className="eyebrow">随手一则 · 第 {String(index + 1).padStart(3, "0")} 则</span>

      <blockquote
        key={quote.id}
        className="animate-fade-up mt-12 max-w-3xl text-balance font-serif text-2xl leading-[1.9] text-ink sm:text-4xl sm:leading-[1.85]"
      >
        {quote.text}
      </blockquote>

      <div className="mt-10 flex flex-col items-center gap-2">
        <Link
          href={`/philosophers/${author?.slug ?? ""}/`}
          className="focus-ring rounded-sm font-serif text-base text-ink transition-colors hover:text-accent"
        >
          {author?.name}
        </Link>
        <span className="font-sans text-2xs tracking-wider text-ink-faint">
          {author?.years} · {quote.source}
        </span>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {quote.themes.map((slug) => {
          const theme = themeBySlug.get(slug);
          if (!theme) return null;
          return (
            <Link
              key={slug}
              href={`/themes/${slug}/`}
              className="focus-ring rounded-full border border-line px-3 py-1 font-sans text-2xs text-ink-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              {theme.name}
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        onClick={reroll}
        className="focus-ring mt-12 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 font-sans text-xs tracking-wider text-ink transition-all duration-300 hover:border-accent/50 hover:text-accent"
      >
        <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} />
        再来一则
      </button>
    </div>
  );
}
