import type { Metadata } from "next";

import { RandomQuote } from "@/components/random-quote";
import { Ornament } from "@/components/ui";
import { quotes } from "@/data";
import { dailyIndex } from "@/lib/utils";

export const metadata: Metadata = {
  title: "随手一则",
  description: "随机抽一则，看看今天碰上的是哪一句。",
};

export default function RandomPage() {
  return (
    <div className="mx-auto max-w-shell px-5 sm:px-8">
      <RandomQuote initialIndex={dailyIndex(quotes.length, new Date(2026, 0, 1))} />
      <Ornament className="pb-6" />
    </div>
  );
}
