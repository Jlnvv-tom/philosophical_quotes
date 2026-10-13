"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bookmark, LogOut } from "lucide-react";

import { useAuth } from "@/lib/auth";

/** 顶栏右侧的账户入口：未登录是「登录」按钮，登录后是昵称首字 + 下拉菜单 */
export function UserMenu() {
  const { configured, user, profile, loading, openAuth, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 点击外部或按 Esc 收起下拉
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!configured) return null;

  if (loading) {
    return <span className="h-9 w-9" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={openAuth}
        className="focus-ring rounded-full border border-line-soft px-3.5 py-2 font-sans text-xs tracking-wider text-ink-muted transition-colors hover:border-line hover:text-ink"
      >
        登录
      </button>
    );
  }

  const initial = (profile?.nickname ?? user.email ?? "·").slice(0, 1);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="账户菜单"
        aria-expanded={open}
        className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-line-soft bg-surface font-serif text-sm text-ink transition-colors hover:border-accent/50 hover:text-accent"
      >
        {initial}
      </button>

      {open && (
        <div className="animate-fade-in absolute right-0 top-11 z-50 w-44 rounded-lg border border-line-soft bg-surface p-1.5 shadow-lift">
          <p className="truncate px-2.5 pb-1.5 pt-2 font-sans text-2xs text-ink-faint">
            {profile?.nickname ?? user.email}
          </p>
          <Link
            href="/favorites/"
            onClick={() => setOpen(false)}
            className="focus-ring flex items-center gap-2 rounded-md px-2.5 py-2 font-sans text-xs text-ink-soft transition-colors hover:bg-sunk hover:text-ink"
          >
            <Bookmark className="h-3.5 w-3.5" strokeWidth={1.6} />
            我的收藏
          </Link>
          <button
            type="button"
            onClick={async () => {
              setOpen(false);
              await signOut();
            }}
            className="focus-ring flex w-full items-center gap-2 rounded-md px-2.5 py-2 font-sans text-xs text-ink-soft transition-colors hover:bg-sunk hover:text-accent"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.6} />
            退出登录
          </button>
        </div>
      )}
    </div>
  );
}
