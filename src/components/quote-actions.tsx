"use client";

import { useCallback, useEffect, useState } from "react";
import { Bookmark, Check, Heart, MessageCircle, Share2 } from "lucide-react";

import { Comments } from "@/components/comments";
import { useAuth } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Stats {
  likes: number;
  favorites: number;
  comments: number;
}

const EMPTY_STATS: Stats = { likes: 0, favorites: 0, comments: 0 };

/**
 * 引文卡片的互动栏：点赞 / 收藏 / 转发 / 评论。
 * 未配置 Supabase 时只保留「转发」，整站仍是纯静态阅读站。
 */
export function QuoteActions({
  quoteId,
  shareText,
  className,
}: {
  quoteId: string;
  /** 转发文案（含引文、作者、出处），由服务端组件拼好传入，避免客户端引入数据层 */
  shareText: string;
  className?: string;
}) {
  const { user, requireAuth } = useAuth();
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [liked, setLiked] = useState(false);
  const [faved, setFaved] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // 初始加载：公开计数 +（登录时）本人的点赞/收藏状态
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    let cancelled = false;

    supabase
      .from("quote_stats")
      .select("likes, favorites, comments")
      .eq("quote_id", quoteId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data) setStats(data);
      });

    if (user) {
      supabase
        .from("likes")
        .select("quote_id")
        .eq("user_id", user.id)
        .eq("quote_id", quoteId)
        .maybeSingle()
        .then(({ data }) => {
          if (!cancelled) setLiked(Boolean(data));
        });
      supabase
        .from("favorites")
        .select("quote_id")
        .eq("user_id", user.id)
        .eq("quote_id", quoteId)
        .maybeSingle()
        .then(({ data }) => {
          if (!cancelled) setFaved(Boolean(data));
        });
    } else {
      setLiked(false);
      setFaved(false);
    }

    return () => {
      cancelled = true;
    };
  }, [quoteId, user]);

  const toggle = useCallback(
    async (kind: "likes" | "favorites") => {
      const supabase = getSupabase();
      if (!supabase) return;
      if (!user) {
        requireAuth();
        return;
      }
      const active = kind === "likes" ? liked : faved;
      const setActive = kind === "likes" ? setLiked : setFaved;
      const bump = (d: number) =>
        setStats((s) => ({ ...s, [kind]: Math.max(0, s[kind] + d) }));

      // 乐观更新，失败回滚
      setActive(!active);
      bump(active ? -1 : 1);

      const { error } = active
        ? await supabase.from(kind).delete().eq("user_id", user.id).eq("quote_id", quoteId)
        : await supabase.from(kind).insert({ user_id: user.id, quote_id: quoteId });

      if (error) {
        if (error.code === "23505") {
          // 唯一冲突：服务端已存在，以服务端状态为准
          setActive(true);
          return;
        }
        setActive(active);
        bump(active ? 1 : -1);
      }
    },
    [user, liked, faved, quoteId, requireAuth],
  );

  const share = useCallback(async () => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const url = `${window.location.origin}${basePath}/quotes/`;
    const text = `${shareText}\n—— 摘自「哲思」 ${url}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return; // 用户主动取消
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // 剪贴板不可用（非安全上下文等），静默失败
    }
  }, [shareText]);

  return (
    <div className={cn("relative", className)}>
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
        {isSupabaseConfigured && (
          <>
            <ActionButton
              icon={Heart}
              active={liked}
              count={stats.likes}
              label="点赞"
              onClick={() => toggle("likes")}
            />
            <ActionButton
              icon={Bookmark}
              active={faved}
              count={stats.favorites}
              label="收藏"
              onClick={() => toggle("favorites")}
            />
          </>
        )}
        <ActionButton
          icon={copied ? Check : Share2}
          active={copied}
          label={copied ? "已复制" : "转发"}
          onClick={share}
        />
        {isSupabaseConfigured && (
          <ActionButton
            icon={MessageCircle}
            active={commentsOpen}
            count={stats.comments}
            label="评论"
            onClick={() => setCommentsOpen((v) => !v)}
          />
        )}
      </div>

      {isSupabaseConfigured && commentsOpen && (
        <Comments
          quoteId={quoteId}
          onCountChange={(d) =>
            setStats((s) => ({ ...s, comments: Math.max(0, s.comments + d) }))
          }
        />
      )}
    </div>
  );
}

function ActionButton({
  icon: Icon,
  active,
  count,
  label,
  onClick,
}: {
  icon: typeof Heart;
  active?: boolean;
  count?: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "focus-ring inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1.5 font-sans text-2xs transition-colors duration-300",
        active ? "text-accent" : "text-ink-faint hover:border-line-soft hover:text-ink",
      )}
    >
      <Icon
        className="h-3.5 w-3.5"
        strokeWidth={1.6}
        fill={active ? "currentColor" : "none"}
      />
      {typeof count === "number" && count > 0 && (
        <span className="tabular-nums">{count}</span>
      )}
      <span>{label}</span>
    </button>
  );
}
