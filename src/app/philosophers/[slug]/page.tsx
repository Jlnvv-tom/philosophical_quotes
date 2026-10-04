import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { QuoteRow } from "@/components/quote-card";
import { Ornament, PageHeader, Tag } from "@/components/ui";
import {
  authorCounts,
  philosopherBySlug,
  philosophers,
  quoteByAuthor,
  traditions,
} from "@/data";

export function generateStaticParams() {
  return philosophers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = philosopherBySlug.get(slug);
  if (!p) return { title: "未找到" };
  return {
    title: `${p.name}（${p.years}）`,
    description: `${p.name}，${p.era}·${p.school}。${p.tagline}${p.bio.slice(0, 60)}…`,
  };
}

export default async function PhilosopherPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = philosopherBySlug.get(slug);
  if (!person) notFound();

  const list = quoteByAuthor(person.slug);
  const traditionMeta = traditions.find((t) => t.key === person.tradition)!;
  const peers = philosophers
    .filter((p) => p.tradition === person.tradition && p.slug !== person.slug)
    .slice(0, 10);

  return (
    <div className="mx-auto max-w-shell px-5 sm:px-8">
      <PageHeader
        breadcrumb={[
          { label: "首页", href: "/" },
          { label: "哲学家", href: "/philosophers/" },
          { label: person.name },
        ]}
        title={person.name}
        lede={person.tagline}
        meta={
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5">
            <Tag>{person.years}</Tag>
            <Tag>{person.era}</Tag>
            <Tag tone={person.tradition === "cn" ? "accent" : "jade"}>
              {person.school}
            </Tag>
            <span className="font-sans text-2xs text-ink-faint">
              共 {list.length} 则引文
            </span>
          </div>
        }
      >
        <p className="mt-5 font-sans text-xs tracking-[0.18em] text-ink-faint">
          {person.nameOriginal}
        </p>
      </PageHeader>

      <div className="grid gap-14 py-16 lg:grid-cols-[19rem_1fr] lg:gap-20">
        {/* ── 侧栏 ── */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="eyebrow">小传</h2>
          <p className="mt-5 font-serif text-sm leading-8 text-ink-soft">{person.bio}</p>

          <h2 className="eyebrow mt-10">代表作</h2>
          <ul className="mt-5 space-y-3">
            {person.works.map((w) => (
              <li key={w} className="flex gap-3 font-serif text-sm leading-6 text-ink-muted">
                <span className="mt-2.5 h-px w-3 shrink-0 bg-line" aria-hidden />
                <span>{w}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-xl border border-line-soft bg-sunk/60 p-5">
            <p className="font-sans text-2xs leading-6 text-ink-faint">
              本页属于
              <span className="mx-1 text-ink-muted">{traditionMeta.name}</span>
              ，同一传统下共收录 {peers.length + 1} 位哲人。
            </p>
          </div>
        </aside>

        {/* ── 引文 ── */}
        <div>
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
            <h2 className="font-serif text-2xl text-ink">他的话</h2>
            <span className="font-mono text-2xs text-ink-faint">{list.length} 则</span>
          </div>

          {list.length > 0 ? (
            <div>
              {list.map((q) => (
                <QuoteRow key={q.id} quote={q} />
              ))}
            </div>
          ) : (
            <p className="py-16 font-serif text-sm text-ink-faint">
              这一位暂未收录引文。
            </p>
          )}

          <Ornament className="my-16" />

          <section>
            <h2 className="eyebrow mb-6">同一传统的其他人</h2>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {peers.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/philosophers/${p.slug}/`}
                    className="focus-ring group inline-flex items-baseline gap-2 rounded-sm"
                  >
                    <span className="font-serif text-base text-ink-soft transition-colors duration-300 group-hover:text-accent">
                      {p.name}
                    </span>
                    <span className="font-mono text-[0.625rem] text-ink-faint">
                      {authorCounts[p.slug] ?? 0}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
