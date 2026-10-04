import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FeaturedQuote } from "@/components/featured-quote";
import { QuoteCard } from "@/components/quote-card";
import { ThemeIcon } from "@/components/theme-icon";
import { Ornament, SectionHeading, StatPill } from "@/components/ui";
import {
  authorCounts,
  philosopherBySlug,
  philosophers,
  quoteById,
  quoteByTheme,
  quotes,
  stats,
  themeBySlug,
  themeCounts,
  themes,
  traditions,
} from "@/data";
import { dailyIndex } from "@/lib/utils";

const FEATURED_IDS = ["q002", "q056", "q144", "q104", "q057", "q153"];

/** 中西对照所选的主题 */
const CONTRAST_SLUG = "time";

export default function HomePage() {
  const featured = FEATURED_IDS.map((id) => quoteById(id)).filter(
    (q): q is NonNullable<typeof q> => Boolean(q),
  );

  const contrastTheme = themeBySlug.get(CONTRAST_SLUG)!;
  const contrastQuotes = quoteByTheme(CONTRAST_SLUG);
  const contrastCn = contrastQuotes.filter(
    (q) => philosopherBySlug.get(q.author)?.tradition === "cn",
  );
  const contrastWest = contrastQuotes.filter(
    (q) => philosopherBySlug.get(q.author)?.tradition === "west",
  );

  return (
    <>
      {/* ══════════ Hero ══════════ */}
      <section className="border-b border-line-soft">
        <div className="mx-auto max-w-shell px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Philosophia · 中西哲学名言精选</p>

            <h1 className="animate-fade-up mt-8 text-balance font-serif text-[1.9rem] leading-[1.28] tracking-tight text-ink sm:text-6xl sm:leading-[1.15]">
              与古今最清醒的头脑
              <br />
              安静地谈一次话
            </h1>

            <p className="mx-auto mt-8 max-w-xl text-balance font-serif text-base leading-8 text-ink-soft sm:text-lg sm:leading-9">
              这里不给结论，只陈列 {stats.quotes} 则被反复引用过的句子，
              与说出它们的 {stats.philosophers} 个人。
            </p>

            <div className="mt-11 flex flex-wrap items-center justify-center gap-x-9 gap-y-5">
              <StatPill value={stats.quotes} label="则引文" />
              <span className="hidden h-4 w-px bg-line sm:block" />
              <StatPill value={stats.philosophers} label="位哲人" />
              <span className="hidden h-4 w-px bg-line sm:block" />
              <StatPill value={stats.themes} label="个主题" />
            </div>

            <Ornament className="mt-14" />
          </div>

          <div className="mx-auto mt-14 max-w-3xl">
            <FeaturedQuote initialIndex={dailyIndex(quotes.length)} />
          </div>
        </div>
      </section>

      {/* ══════════ 主题 ══════════ */}
      <section className="mx-auto max-w-shell px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading
          index="壹"
          eyebrow="Themes"
          title="十二个主题，十二种追问"
          description="同一个问题，中国哲人与西方哲人给出的路径往往不同——一个偏向安顿，一个偏向澄清。选一个主题进去，看看两边各自怎么说。"
          action={
            <Link
              href="/themes/"
              className="focus-ring group inline-flex items-center gap-2 rounded-sm font-sans text-xs tracking-wider text-ink-muted transition-colors hover:text-accent"
            >
              全部主题
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          }
        />

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <Link
              key={theme.slug}
              href={`/themes/${theme.slug}/`}
              className="focus-ring group relative flex flex-col bg-surface p-7 transition-colors duration-500 hover:bg-paper"
            >
              <div className="flex items-start justify-between gap-4">
                <ThemeIcon
                  name={theme.icon}
                  className={
                    theme.accent === "accent"
                      ? "h-5 w-5 text-accent"
                      : "h-5 w-5 text-jade"
                  }
                />
                <span className="font-mono text-2xs tabular-nums text-ink-faint">
                  {themeCounts[theme.slug]} 则
                </span>
              </div>

              <h3 className="mt-7 font-serif text-xl text-ink transition-colors duration-300 group-hover:text-accent">
                {theme.name}
              </h3>
              <p className="mt-1 font-sans text-2xs uppercase tracking-[0.18em] text-ink-faint">
                {theme.nameEn}
              </p>
              <p className="mt-4 font-serif text-sm leading-7 text-ink-muted">
                {theme.gloss}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════ 精选 ══════════ */}
      <section className="border-y border-line-soft bg-sunk/50">
        <div className="mx-auto max-w-shell px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading
            index="贰"
            eyebrow="Selected"
            title="六则，先读这些也行"
            description="从全部引文中挑出的六条。它们未必最著名，但各自代表一种态度。"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((q) => (
              <QuoteCard key={q.id} quote={q} showNote />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 中西对照 ══════════ */}
      <section className="mx-auto max-w-shell px-5 py-20 sm:px-8 sm:py-24">
        <SectionHeading
          index="叁"
          eyebrow="East / West"
          title={`同问「${contrastTheme.name}」，两种回答`}
          description={contrastTheme.intro}
          action={
            <Link
              href={`/themes/${contrastTheme.slug}/`}
              className="focus-ring group inline-flex items-center gap-2 rounded-sm font-sans text-xs tracking-wider text-ink-muted transition-colors hover:text-accent"
            >
              进入主题
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          }
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {[
            { key: "cn", label: "中国", list: contrastCn },
            { key: "west", label: "西方", list: contrastWest },
          ].map((col) => (
            <div key={col.key}>
              <div className="flex items-center gap-4">
                <span className="font-serif text-2xl text-ink">{col.label}</span>
                <span className="h-px flex-1 bg-line" />
                <span className="font-mono text-2xs text-ink-faint">
                  {col.list.length} 则
                </span>
              </div>
              <ul className="mt-8 space-y-8">
                {col.list.map((q) => {
                  const author = philosopherBySlug.get(q.author);
                  return (
                    <li key={q.id} className="border-l-2 border-line pl-5">
                      <p className="font-serif text-base leading-8 text-ink">{q.text}</p>
                      <Link
                        href={`/philosophers/${author?.slug ?? ""}/`}
                        className="focus-ring mt-3 inline-block rounded-sm font-sans text-2xs tracking-wider text-ink-muted transition-colors hover:text-accent"
                      >
                        {author?.name} · {q.source}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ 群像 ══════════ */}
      <section className="border-y border-line-soft bg-sunk/50">
        <div className="mx-auto max-w-shell px-5 py-20 sm:px-8 sm:py-24">
          <SectionHeading
            index="肆"
            eyebrow="Who Said It"
            title="说话的人"
            description="从先秦到二十世纪，从爱琴海到巴黎。点击任意一位，可以读到他的小传与全部引文。"
          />

          <div className="mt-14 space-y-14">
            {traditions.map((t) => (
              <div key={t.key}>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="font-serif text-2xl text-ink">{t.name}</h3>
                  <span className="font-sans text-2xs uppercase tracking-[0.18em] text-ink-faint">
                    {t.nameEn}
                  </span>
                </div>

                <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-3.5">
                  {philosophers
                    .filter((p) => p.tradition === t.key)
                    .map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/philosophers/${p.slug}/`}
                          className="focus-ring group inline-flex items-baseline gap-2 rounded-sm"
                          title={`${p.school} · ${authorCounts[p.slug] ?? 0} 则引文`}
                        >
                          <span className="font-serif text-base text-ink-soft transition-colors duration-300 group-hover:text-accent">
                            {p.name}
                          </span>
                          <span className="font-mono text-[0.625rem] text-ink-faint">
                            {p.years}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>

                <p className="mt-7 max-w-2xl font-sans text-xs leading-6 text-ink-faint">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ 收束 ══════════ */}
      <section className="mx-auto max-w-shell px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <Ornament />
          <blockquote className="mt-12 text-balance font-serif text-2xl leading-[1.85] text-ink sm:text-3xl sm:leading-[1.8]">
            未经省察的人生，是不值得过的。
          </blockquote>
          <p className="mt-7 font-sans text-2xs tracking-widest text-ink-faint">
            苏格拉底 · 柏拉图《申辩篇》
          </p>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/quotes/"
              className="focus-ring group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-sans text-xs tracking-wider text-paper transition-all duration-300 hover:gap-3"
            >
              开始翻阅全部引文
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
            <Link
              href="/random/"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-sans text-xs tracking-wider text-ink-muted transition-colors hover:border-accent/50 hover:text-accent"
            >
              随手一则
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
