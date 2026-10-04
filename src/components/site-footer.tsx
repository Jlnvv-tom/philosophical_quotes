import Link from "next/link";

import { Ornament } from "./ui";
import { stats } from "@/data";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line-soft bg-sunk/60">
      <div className="mx-auto max-w-shell px-5 py-14 sm:px-8">
        <Ornament className="mb-12" />

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center border border-line bg-surface font-serif text-base text-ink">
                哲
              </span>
              <span className="font-serif text-base tracking-[0.32em] text-ink">哲思</span>
            </div>
            <p className="mt-5 max-w-sm font-serif text-sm leading-7 text-ink-muted">
              收录中国与西方哲学中 {stats.quotes} 则可考出处的语句，
              按 {stats.themes} 个主题编排，供随手翻阅，不作结论。
            </p>
          </div>

          <nav aria-label="浏览">
            <h2 className="eyebrow mb-4">浏览</h2>
            <ul className="space-y-2.5 font-sans text-sm">
              {[
                { href: "/quotes/", label: "全部名言" },
                { href: "/philosophers/", label: "哲学家" },
                { href: "/themes/", label: "按主题" },
                { href: "/random/", label: "随手一则" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="link-underline focus-ring rounded-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="关于本站">
            <h2 className="eyebrow mb-4">关于</h2>
            <ul className="space-y-2.5 font-sans text-sm">
              <li>
                <Link
                  href="/about/"
                  className="link-underline focus-ring rounded-sm text-ink-muted transition-colors hover:text-ink"
                >
                  编辑原则与来源
                </Link>
              </li>
              <li className="text-ink-muted">
                <span className="font-mono text-2xs">{stats.cn} 位中国哲人</span>
              </li>
              <li className="text-ink-muted">
                <span className="font-mono text-2xs">{stats.west} 位西方哲人</span>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line-soft pt-6 font-sans text-2xs tracking-wide text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} 哲思 · 一个静态的阅读项目</p>
          <p>引文均标注出处；译文以通行中译为准，不作学术引用依据。</p>
        </div>
      </div>
    </footer>
  );
}
