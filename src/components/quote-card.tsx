import Link from "next/link";

import { philosopherBySlug, themeBySlug } from "@/data";
import type { Quote } from "@/data/types";
import { cn } from "@/lib/utils";

/** 引文卡片：用于网格陈列 */
export function QuoteCard({
  quote,
  showThemes = true,
  showNote = false,
  className,
}: {
  quote: Quote;
  showThemes?: boolean;
  showNote?: boolean;
  className?: string;
}) {
  const author = philosopherBySlug.get(quote.author);
  if (!author) return null;

  return (
    <figure
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-line-soft bg-surface p-7 shadow-card transition-all duration-500 hover:-translate-y-0.5 hover:border-line hover:shadow-lift",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-7 right-2 select-none font-serif text-[7rem] leading-none text-ink/[0.045] transition-colors duration-500 group-hover:text-accent/10"
      >
        &rdquo;
      </span>

      <blockquote className="relative font-serif text-[1.0625rem] leading-9 text-ink">
        {quote.text}
      </blockquote>

      {showNote && quote.note && (
        <p className="relative mt-5 border-l-2 border-line pl-3.5 font-sans text-xs leading-6 text-ink-faint">
          {quote.note}
        </p>
      )}

      <figcaption className="relative mt-6 flex items-end justify-between gap-4 border-t border-line-soft pt-5">
        <Link
          href={`/philosophers/${author.slug}/`}
          className="focus-ring group/link min-w-0 rounded-sm"
        >
          <span className="block truncate font-serif text-sm text-ink transition-colors duration-300 group-hover/link:text-accent">
            {author.name}
          </span>
          <span className="mt-1 block truncate font-sans text-2xs leading-4 text-ink-faint">
            {quote.source}
          </span>
        </Link>

        {showThemes && (
          <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
            {quote.themes.slice(0, 2).map((slug) => {
              const theme = themeBySlug.get(slug);
              if (!theme) return null;
              return (
                <Link
                  key={slug}
                  href={`/themes/${slug}/`}
                  className="focus-ring rounded-full border border-line px-2 py-0.5 font-sans text-[0.625rem] tracking-wide text-ink-faint transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {theme.name}
                </Link>
              );
            })}
          </div>
        )}
      </figcaption>
    </figure>
  );
}

/** 引文行：用于长列表 / 详情页 */
export function QuoteRow({
  quote,
  showNote = true,
  showIndex,
}: {
  quote: Quote;
  showNote?: boolean;
  showIndex?: number;
}) {
  const author = philosopherBySlug.get(quote.author);
  if (!author) return null;

  return (
    <article className="group grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 border-b border-line-soft py-7 last:border-0">
      {typeof showIndex === "number" && (
        <span className="mt-1 font-mono text-2xs tabular-nums text-ink-faint">
          {String(showIndex).padStart(2, "0")}
        </span>
      )}
      <div className={cn(typeof showIndex !== "number" && "col-span-2")}>
        <blockquote className="font-serif text-[1.0625rem] leading-9 text-ink sm:text-lg">
          {quote.text}
        </blockquote>

        {showNote && quote.note && (
          <p className="mt-3 font-sans text-xs leading-6 text-ink-faint">{quote.note}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <Link
            href={`/philosophers/${author.slug}/`}
            className="focus-ring rounded-sm font-sans text-2xs tracking-wider text-ink-muted transition-colors hover:text-accent"
          >
            {author.name}
          </Link>
          <span className="font-sans text-2xs text-ink-faint">{quote.source}</span>
          <span className="hidden h-3 w-px bg-line sm:block" />
          <span className="flex flex-wrap gap-1.5">
            {quote.themes.map((slug) => {
              const theme = themeBySlug.get(slug);
              if (!theme) return null;
              return (
                <Link
                  key={slug}
                  href={`/themes/${slug}/`}
                  className="focus-ring rounded-full border border-line px-2 py-0.5 font-sans text-[0.625rem] text-ink-faint transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {theme.name}
                </Link>
              );
            })}
          </span>
        </div>
      </div>
    </article>
  );
}
