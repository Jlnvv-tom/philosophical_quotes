import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { QuoteRow } from "@/components/quote-card";
import { ThemeIcon } from "@/components/theme-icon";
import { Ornament, PageHeader } from "@/components/ui";
import {
  philosopherBySlug,
  quoteByTheme,
  themeBySlug,
  themes,
} from "@/data";

export function generateStaticParams() {
  return themes.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = themeBySlug.get(slug);
  if (!t) return { title: "未找到" };
  return {
    title: `${t.name} · ${t.nameEn}`,
    description: t.gloss + "——" + t.intro.slice(0, 70) + "…",
  };
}

export default async function ThemePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = themeBySlug.get(slug);
  if (!theme) notFound();

  const all = quoteByTheme(theme.slug);
  const groups = [
    {
      key: "cn",
      label: "中国",
      list: all.filter((q) => philosopherBySlug.get(q.author)?.tradition === "cn"),
    },
    {
      key: "west",
      label: "西方",
      list: all.filter((q) => philosopherBySlug.get(q.author)?.tradition === "west"),
    },
  ].filter((g) => g.list.length > 0);

  return (
    <div className="mx-auto max-w-shell px-5 sm:px-8">
      <PageHeader
        breadcrumb={[
          { label: "首页", href: "/" },
          { label: "主题", href: "/themes/" },
          { label: theme.name },
        ]}
        title={theme.name}
        lede={theme.intro}
        meta={
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="inline-flex items-center gap-2 font-sans text-2xs tracking-wider text-ink-muted">
              <ThemeIcon
                name={theme.icon}
                className={theme.accent === "accent" ? "h-4 w-4 text-accent" : "h-4 w-4 text-jade"}
              />
              {theme.nameEn}
            </span>
            <span className="h-4 w-px bg-line" />
            <span className="font-sans text-2xs text-ink-faint">
              共 {all.length} 则引文
            </span>
          </div>
        }
      >
        <div className="mt-8 flex flex-wrap gap-2">
          {theme.questions.map((q) => (
            <span
              key={q}
              className="rounded-full border border-line-soft bg-sunk/60 px-3.5 py-1.5 font-serif text-xs text-ink-muted"
            >
              {q}
            </span>
          ))}
        </div>
      </PageHeader>

      <div className="py-16">
        {groups.map((group, gi) => (
          <section key={group.key} className={gi > 0 ? "mt-20" : undefined}>
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
              <h2 className="font-serif text-2xl text-ink">{group.label}的说法</h2>
              <span className="font-mono text-2xs tabular-nums text-ink-faint">
                {group.list.length} 则
              </span>
            </div>

            <div className="grid lg:grid-cols-2 lg:gap-x-16">
              {group.list.map((q) => (
                <QuoteRow key={q.id} quote={q} />
              ))}
            </div>
          </section>
        ))}

        <Ornament className="my-20" />

        <section>
          <h2 className="eyebrow mb-7">换个主题</h2>
          <ul className="flex flex-wrap gap-2">
            {themes
              .filter((t) => t.slug !== theme.slug)
              .map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/themes/${t.slug}/`}
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 font-sans text-xs text-ink-muted transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    <ThemeIcon name={t.icon} className="h-3.5 w-3.5" strokeWidth={1.4} />
                    {t.name}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
