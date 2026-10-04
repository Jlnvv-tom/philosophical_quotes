import Link from "next/link";

import { Ornament } from "@/components/ui";
import { quoteById } from "@/data";

export default function NotFound() {
  const quote = quoteById("q057");

  return (
    <div className="mx-auto flex min-h-[62vh] max-w-2xl flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
      <p className="font-mono text-2xs tracking-widest text-ink-faint">404</p>

      <h1 className="mt-8 text-balance font-serif text-3xl leading-tight text-ink sm:text-4xl">
        这一页不在收藏里
      </h1>

      <p className="mt-6 font-serif text-sm leading-8 text-ink-muted">
        可能是链接过期，也可能是这条引文还没被收录。与其停在这里，不如——
      </p>

      <Ornament className="my-12" />

      <blockquote className="text-balance font-serif text-lg leading-9 text-ink">
        {quote?.text}
      </blockquote>
      <p className="mt-4 font-sans text-2xs tracking-widest text-ink-faint">
        苏格拉底 · 柏拉图《申辩篇》
      </p>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="focus-ring rounded-full bg-ink px-6 py-3 font-sans text-xs tracking-wider text-paper transition-opacity hover:opacity-90"
        >
          回到首页
        </Link>
        <Link
          href="/random/"
          className="focus-ring rounded-full border border-line px-6 py-3 font-sans text-xs tracking-wider text-ink-muted transition-colors hover:border-accent/50 hover:text-accent"
        >
          随手一则
        </Link>
      </div>
    </div>
  );
}
