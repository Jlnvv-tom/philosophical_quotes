"use client";

import { useEffect, useState } from "react";

import { QuoteCard } from "@/components/quote-card";
import { quoteById } from "@/data";
import type { Quote } from "@/data/types";
import { useAuth } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

/** 「我的收藏」列表：拉取本人收藏的 quote_id，映射回本地引文数据 */
export function FavoritesList() {
  const { user, loading, openAuth } = useAuth();
  const [quotes, setQuotes] = useState<Quote[] | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase || !user) {
      setQuotes(null);
      return;
    }
    let cancelled = false;
    supabase
      .from("favorites")
      .select("quote_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (cancelled) return;
        setQuotes(
          (data ?? [])
            .map((row) => quoteById(row.quote_id))
            .filter((q): q is Quote => Boolean(q)),
        );
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!isSupabaseConfigured) {
    return (
      <p className="py-16 text-center font-sans text-sm text-ink-muted">
        本站暂未开启用户系统。
      </p>
    );
  }

  if (loading) return null;

  if (!user) {
    return (
      <div className="py-16 text-center">
        <p className="font-serif text-lg text-ink-soft">
          登录后，这里会收起你动过心的句子。
        </p>
        <button
          type="button"
          onClick={openAuth}
          className="focus-ring mt-6 rounded-full bg-ink px-6 py-2.5 font-sans text-sm text-paper transition-colors hover:bg-accent"
        >
          登录 / 注册
        </button>
      </div>
    );
  }

  if (!quotes) {
    return (
      <p className="py-16 text-center font-sans text-sm text-ink-faint">正在拾取……</p>
    );
  }

  if (quotes.length === 0) {
    return (
      <p className="py-16 text-center font-serif text-lg leading-9 text-ink-soft">
        尚无收藏。
        <br />
        <span className="font-sans text-sm text-ink-faint">
          读到动心处，点一下书签，它会在这里等你。
        </span>
      </p>
    );
  }

  return (
    <div className="grid gap-6 pt-12 sm:grid-cols-2">
      {quotes.map((q) => (
        <QuoteCard key={q.id} quote={q} />
      ))}
    </div>
  );
}
