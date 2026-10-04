import type { Metadata } from "next";
import Link from "next/link";

import { ThemeIcon } from "@/components/theme-icon";
import { PageHeader } from "@/components/ui";
import { themeCounts, themes } from "@/data";

export const metadata: Metadata = {
  title: "主题",
  description:
    "生死、自由、幸福、求知、德性、时间、逆境、自我、爱、意义、行动、孤独——十二个主题下的中西对照。",
};

export default function ThemesPage() {
  return (
    <div className="mx-auto max-w-shell px-5 sm:px-8">
      <PageHeader
        breadcrumb={[{ label: "首页", href: "/" }, { label: "主题" }]}
        title="十二个主题"
        lede="分类是不得已的手段——同一句话常常同时属于好几个主题。但分出条理之后，你会更容易看见：哪些问题是所有人都在问的。"
      />

      <div>
        {themes.map((theme, i) => (
          <Link
            key={theme.slug}
            href={`/themes/${theme.slug}/`}
            className="focus-ring group grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-4 border-b border-line-soft py-10 transition-colors duration-500 last:border-0 sm:grid-cols-[3rem_14rem_1fr_auto] sm:gap-x-10 hover:bg-sunk/40"
          >
            <span className="pt-1 font-mono text-2xs tabular-nums text-ink-faint">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-3">
                <ThemeIcon
                  name={theme.icon}
                  className={
                    theme.accent === "accent" ? "h-5 w-5 text-accent" : "h-5 w-5 text-jade"
                  }
                />
                <h2 className="font-serif text-2xl text-ink transition-colors duration-300 group-hover:text-accent">
                  {theme.name}
                </h2>
              </div>
              <p className="mt-2 font-sans text-2xs uppercase tracking-[0.18em] text-ink-faint">
                {theme.nameEn}
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="max-w-2xl font-serif text-sm leading-7 text-ink-soft">
                {theme.intro}
              </p>
              <ul className="mt-4 space-y-1.5">
                {theme.questions.map((q) => (
                  <li key={q} className="font-sans text-xs leading-6 text-ink-faint">
                    — {q}
                  </li>
                ))}
              </ul>
            </div>

            <span className="col-span-2 font-mono text-2xs tabular-nums text-ink-faint sm:col-span-1 sm:pt-2">
              {themeCounts[theme.slug]} 则
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
