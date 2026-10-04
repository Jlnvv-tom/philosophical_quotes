import type { Metadata } from "next";

import { QuoteBrowser } from "@/components/quote-browser";
import { PageHeader, StatPill } from "@/components/ui";
import { quotes, stats } from "@/data";

export const metadata: Metadata = {
  title: "全部名言",
  description: "按主题、传统筛选，或直接搜索语句、哲人与出处。",
};

export default function QuotesPage() {
  return (
    <div className="mx-auto max-w-shell px-5 sm:px-8">
      <PageHeader
        breadcrumb={[{ label: "首页", href: "/" }, { label: "名言" }]}
        title="全部名言"
        lede="按主题、按传统筛选，或者直接搜索。这里只给句子和它的来处，不替你下判断。"
        meta={
          <div className="flex flex-wrap items-center gap-x-9 gap-y-4">
            <StatPill value={stats.quotes} label="则引文" />
            <StatPill value={stats.philosophers} label="位哲人" />
            <StatPill value={stats.themes} label="个主题" />
          </div>
        }
      />

      <div className="pt-12">
        <QuoteBrowser />
      </div>

      <p className="border-t border-line-soft py-10 text-center font-sans text-2xs text-ink-faint">
        共收录 {quotes.length} 则 · 引文均标注出处，译文以通行中译为准
      </p>
    </div>
  );
}
