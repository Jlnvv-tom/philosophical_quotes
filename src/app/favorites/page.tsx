import type { Metadata } from "next";

import { FavoritesList } from "@/components/favorites-list";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "我的收藏",
  description: "你收藏的所有引文。",
};

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-shell px-5 pb-24 sm:px-8">
      <PageHeader
        breadcrumb={[{ label: "首页", href: "/" }, { label: "我的收藏" }]}
        title="我的收藏"
        lede="凡是动心处，皆留于此。"
      />
      <FavoritesList />
    </div>
  );
}
