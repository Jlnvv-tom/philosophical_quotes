"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { useAuth } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface CommentItem {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  nickname: string;
}

/** 评论区：公开可读，登录可发，本人可删 */
export function Comments({
  quoteId,
  onCountChange,
}: {
  quoteId: string;
  /** 发表/删除成功后通知父组件同步计数 */
  onCountChange: (delta: number) => void;
}) {
  const { user, profile, requireAuth } = useAuth();
  const [items, setItems] = useState<CommentItem[] | null>(null); // null = 加载中
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let cancelled = false;

    supabase
      .from("comments")
      .select("id, content, created_at, user_id, profiles(nickname)")
      .eq("quote_id", quoteId)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err) {
          setItems([]);
          setError("评论加载失败，请稍后再试");
          return;
        }
        setItems(
          (data ?? []).map((row) => {
            // 联表结果可能是对象或数组，两种都兜住
            const p = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
            return {
              id: row.id,
              content: row.content,
              created_at: row.created_at,
              user_id: row.user_id,
              nickname: (p as { nickname?: string } | null)?.nickname ?? "无名氏",
            };
          }),
        );
      });

    return () => {
      cancelled = true;
    };
  }, [quoteId]);

  const submit = async () => {
    const content = draft.trim();
    if (!content || posting) return;
    if (!requireAuth()) return;
    const supabase = getSupabase();
    if (!supabase || !user) return;
    if (content.length > 500) {
      setError("评论最长 500 字");
      return;
    }

    setPosting(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("comments")
      .insert({ quote_id: quoteId, user_id: user.id, content })
      .select("id, created_at")
      .single();
    setPosting(false);

    if (err) {
      setError("发表失败，请稍后再试");
      return;
    }
    setItems((list) => [
      {
        id: data.id,
        content,
        created_at: data.created_at,
        user_id: user.id,
        nickname: profile?.nickname ?? "我",
      },
      ...(list ?? []),
    ]);
    setDraft("");
    onCountChange(1);
  };

  const remove = async (id: number) => {
    const supabase = getSupabase();
    if (!supabase) return;
    const prev = items;
    setItems((list) => list?.filter((c) => c.id !== id) ?? list);
    const { error: err } = await supabase.from("comments").delete().eq("id", id);
    if (err) {
      setItems(prev); // 回滚
      return;
    }
    onCountChange(-1);
  };

  return (
    <div className="animate-fade-in mt-4 rounded-lg border border-line-soft bg-sunk/60 p-4">
      <div className="flex items-start gap-2.5">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          maxLength={500}
          placeholder={user ? "写下所感……" : "登录后可留言"}
          aria-label="评论输入框"
          className="focus-ring min-w-0 flex-1 resize-y rounded-md border border-line bg-paper px-3 py-2 font-sans text-sm leading-6 text-ink placeholder:text-ink-faint"
        />
        <button
          type="button"
          onClick={submit}
          disabled={posting || !draft.trim()}
          className={cn(
            "focus-ring shrink-0 rounded-full bg-ink px-4 py-2 font-sans text-xs text-paper transition-colors",
            posting || !draft.trim() ? "cursor-not-allowed opacity-50" : "hover:bg-accent",
          )}
        >
          {posting ? "发表中" : "发表"}
        </button>
      </div>
      {error && (
        <p className="mt-2 font-sans text-xs text-accent" role="alert">
          {error}
        </p>
      )}

      <ul className="mt-2 divide-y divide-line-soft">
        {items === null && (
          <li className="py-4 font-sans text-xs text-ink-faint">评论加载中…</li>
        )}
        {items?.length === 0 && (
          <li className="py-4 font-sans text-xs text-ink-faint">
            还无人留言。第一句，往往最难，也最值得。
          </li>
        )}
        {items?.map((c) => (
          <li key={c.id} className="group py-3.5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="min-w-0 font-sans text-2xs tracking-wide text-ink-muted">
                <span className="text-ink">{c.nickname}</span>
                <span className="mx-2 text-line">·</span>
                <time dateTime={c.created_at}>
                  {new Date(c.created_at).toLocaleString("zh-CN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </p>
              {user?.id === c.user_id && (
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  aria-label="删除评论"
                  className="focus-ring shrink-0 rounded-full p-1 text-ink-faint opacity-0 transition-all hover:text-accent group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              )}
            </div>
            <p className="mt-1.5 whitespace-pre-wrap font-sans text-sm leading-6 text-ink-soft">
              {c.content}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
