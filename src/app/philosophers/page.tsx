import type { Metadata } from "next";

import { PageHeader } from "@/components/ui";
import { authorCounts, philosophers, traditions } from "@/data";
import Link from "next/link";

export const metadata: Metadata = {
  title: "哲学家",
  description: "从先秦诸子到二十世纪的存在主义者，每位附小传与全部引文。",
};

export default function PhilosophersPage() {
  return (
    <div className="mx-auto max-w-shell px-5 sm:px-8">
      <PageHeader
        breadcrumb={[{ label: "首页", href: "/" }, { label: "哲学家" }]}
        title="哲学家的群像"
        lede="这里收录的人跨越两千五百年。把他们放在一起看，会发现「哲学」其实是一群人在不同处境里，反复追问相似的问题。"
      />

      <div className="space-y-20 py-16">
        {traditions.map((t) => {
          const list = philosophers.filter((p) => p.tradition === t.key);
          return (
            <section key={t.key}>
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
                <div>
                  <h2 className="font-serif text-3xl text-ink">{t.name}</h2>
                  <p className="mt-2 font-sans text-2xs uppercase tracking-[0.18em] text-ink-faint">
                    {t.nameEn}
                  </p>
                </div>
                <span className="font-mono text-2xs text-ink-faint">{list.length} 位</span>
              </div>

              <p className="mt-6 max-w-2xl font-serif text-sm leading-7 text-ink-muted">
                {t.desc}
              </p>

              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/philosophers/${p.slug}/`}
                    className="focus-ring group flex h-full flex-col rounded-xl border border-line-soft bg-surface p-6 shadow-card transition-all duration-500 hover:-translate-y-0.5 hover:border-line hover:shadow-lift"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-serif text-xl text-ink transition-colors duration-300 group-hover:text-accent">
                        {p.name}
                      </h3>
                      <span className="shrink-0 font-mono text-[0.625rem] text-ink-faint">
                        {authorCounts[p.slug] ?? 0} 则
                      </span>
                    </div>

                    <p className="mt-1.5 font-sans text-2xs text-ink-faint">{p.nameOriginal}</p>

                    <p className="mt-4 font-serif text-sm leading-7 text-ink-soft">
                      {p.tagline}
                    </p>

                    <div className="mt-auto flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-6 font-sans text-[0.625rem] tracking-wide text-ink-faint">
                      <span>{p.years}</span>
                      <span className="h-2.5 w-px bg-line" />
                      <span>{p.era}</span>
                      <span className="h-2.5 w-px bg-line" />
                      <span>{p.school}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
