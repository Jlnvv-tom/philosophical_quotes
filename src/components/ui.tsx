import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** 章节标题：不是 h2 的样式，而是"书的目录项"的样式 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-6", className)}>
      <div className="max-w-2xl">
        {(index || eyebrow) && (
          <div className="mb-4 flex items-center gap-3">
            {index && (
              <span className="font-mono text-2xs tabular-nums text-accent">{index}</span>
            )}
            {index && eyebrow && <span className="h-px w-6 bg-line" />}
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          </div>
        )}
        <h2 className="text-balance font-serif text-2xl tracking-tight text-ink sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 font-sans text-sm leading-7 text-ink-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/** 装饰性分隔：短横 + 菱形 + 短横 */
export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-3 text-line", className)} aria-hidden>
      <span className="h-px w-10 bg-current" />
      <span className="block h-1 w-1 rotate-45 bg-current" />
      <span className="h-px w-10 bg-current" />
    </div>
  );
}

/** 页面顶部的面包屑 + 标题区 */
export function PageHeader({
  breadcrumb,
  title,
  lede,
  meta,
  children,
}: {
  breadcrumb?: { label: string; href?: string }[];
  title: string;
  lede?: string;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-line-soft pb-12 pt-14 sm:pt-20">
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="mb-8 flex flex-wrap items-center gap-2 font-sans text-2xs tracking-wider text-ink-faint">
          {breadcrumb.map((c, i) => (
            <span key={`${c.label}-${i}`} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {c.href ? (
                <a href={c.href} className="link-underline focus-ring rounded-sm text-ink-muted hover:text-ink">
                  {c.label}
                </a>
              ) : (
                <span className="text-ink-muted">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-balance font-serif text-3xl leading-tight tracking-tight text-ink sm:text-5xl">
        {title}
      </h1>
      {lede && (
        <p className="mt-6 max-w-2xl font-serif text-base leading-8 text-ink-soft sm:text-lg sm:leading-9">
          {lede}
        </p>
      )}
      {meta && <div className="mt-8">{meta}</div>}
      {children}
    </header>
  );
}

/** 数据胶囊 */
export function StatPill({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-serif text-lg tabular-nums text-ink">{value}</span>
      <span className="font-sans text-2xs tracking-wider text-ink-faint">{label}</span>
    </div>
  );
}

/** 主题 / 学派标签 */
export function Tag({
  children,
  href,
  tone = "neutral",
}: {
  children: ReactNode;
  href?: string;
  tone?: "neutral" | "accent" | "jade";
}) {
  const toneCls =
    tone === "accent"
      ? "border-accent/25 text-accent"
      : tone === "jade"
        ? "border-jade/30 text-jade"
        : "border-line text-ink-muted";
  const cls = cn(
    "focus-ring inline-flex items-center rounded-full border px-2.5 py-0.5 font-sans text-2xs tracking-wide transition-colors",
    toneCls,
    href && "hover:border-current hover:bg-sunk",
  );
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return <span className={cls}>{children}</span>;
}
