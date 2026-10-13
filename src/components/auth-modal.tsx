"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";

import type { SignUpResult } from "@/lib/auth";
import { cn } from "@/lib/utils";

/**
 * 登录 / 注册弹窗。
 * 纯展示与表单逻辑；鉴权动作由 AuthProvider 通过 props 注入，避免与 auth.tsx 循环引用。
 */
export function AuthModal({
  open,
  onClose,
  signIn,
  signUp,
}: {
  open: boolean;
  onClose: () => void;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, nickname: string) => Promise<SignUpResult>;
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // 打开时锁滚动、支持 Esc 关闭；关闭时重置表单
  useEffect(() => {
    if (!open) {
      setError(null);
      setNotice(null);
      setBusy(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setNotice(null);

    if (mode === "signup") {
      if (!nickname.trim()) {
        setError("请填写昵称");
        return;
      }
      if (password.length < 6) {
        setError("密码至少 6 位");
        return;
      }
    }

    setBusy(true);
    try {
      if (mode === "signin") {
        const err = await signIn(email.trim(), password);
        if (err) {
          setError(err);
          return;
        }
        onClose();
      } else {
        const { error: err, needConfirm } = await signUp(
          email.trim(),
          password,
          nickname.trim(),
        );
        if (err) {
          setError(err);
          return;
        }
        if (needConfirm) {
          setNotice("验证邮件已发送，请前往邮箱完成确认后再登录。");
          setMode("signin");
        } else {
          onClose();
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "focus-ring w-full rounded-md border border-line bg-paper px-3.5 py-2.5 font-sans text-sm text-ink placeholder:text-ink-faint";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
      aria-label={mode === "signin" ? "登录" : "注册"}
    >
      <button
        type="button"
        aria-label="关闭"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/45 backdrop-blur-sm"
      />

      <div className="animate-fade-up relative w-full max-w-sm rounded-xl border border-line-soft bg-surface p-8 shadow-lift">
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          className="focus-ring absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors hover:text-ink"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <p className="eyebrow">{mode === "signin" ? "Welcome back" : "Join us"}</p>
        <h2 className="mt-2 font-serif text-2xl tracking-tight text-ink">
          {mode === "signin" ? "登录" : "注册"}
        </h2>
        <p className="mt-2 font-sans text-xs leading-5 text-ink-muted">
          {mode === "signin" ? "回来继续读，也继续标记动心的句子。" : "一个邮箱即可。收藏、点赞与评论，都归在你名下。"}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3.5">
          {mode === "signup" && (
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="昵称"
              maxLength={24}
              autoComplete="nickname"
              className={inputCls}
            />
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="邮箱"
            autoComplete="email"
            className={inputCls}
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "signup" ? "密码（至少 6 位）" : "密码"}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className={inputCls}
          />

          {error && (
            <p className="font-sans text-xs leading-5 text-accent" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="font-sans text-xs leading-5 text-jade" role="status">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className={cn(
              "focus-ring w-full rounded-full bg-ink py-2.5 font-sans text-sm text-paper transition-colors",
              busy ? "cursor-wait opacity-60" : "hover:bg-accent",
            )}
          >
            {busy ? "请稍候…" : mode === "signin" ? "登录" : "注册"}
          </button>
        </form>

        <p className="mt-5 text-center font-sans text-xs text-ink-faint">
          {mode === "signin" ? "还没有账号？" : "已有账号？"}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
            className="focus-ring link-underline ml-1 rounded-sm text-ink-muted hover:text-accent"
          >
            {mode === "signin" ? "立即注册" : "直接登录"}
          </button>
        </p>
      </div>
    </div>
  );
}
