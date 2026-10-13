"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";

import { AuthModal } from "@/components/auth-modal";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export interface Profile {
  nickname: string;
}

export interface SignUpResult {
  error: string | null;
  /** true 表示 Supabase 开了邮箱验证，需先收邮件才能完成注册 */
  needConfirm: boolean;
}

interface AuthContextValue {
  /** 是否配置了 Supabase；未配置时互动 UI 全部隐藏 */
  configured: boolean;
  user: User | null;
  profile: Profile | null;
  /** 首次会话恢复中 */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, nickname: string) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  /** 打开登录/注册弹窗 */
  openAuth: () => void;
  /** 已登录返回 true；未登录则弹出登录框并返回 false */
  requireAuth: () => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth 必须在 <AuthProvider> 内使用");
  return ctx;
}

function translateAuthError(message: string): string {
  if (message.includes("Invalid login")) return "邮箱或密码不正确";
  if (message.includes("Email not confirmed"))
    return "邮箱尚未验证，请先到邮箱点击确认链接";
  if (message.includes("already registered")) return "该邮箱已注册，请直接登录";
  if (message.includes("Unable to validate email")) return "邮箱格式不正确";
  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadProfile = async (u: User | null) => {
      if (!u) {
        if (!cancelled) setProfile(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", u.id)
        .maybeSingle();
      if (cancelled) return;
      setProfile({
        nickname: data?.nickname ?? u.email?.split("@")[0] ?? "无名氏",
      });
    };

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) return;
        const u = data.session?.user ?? null;
        setUser(u);
        void loadProfile(u);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setLoading(false);
      // 在回调里直接调 Supabase 查询会占用 auth 锁，延迟到下一拍
      setTimeout(() => {
        if (!cancelled) void loadProfile(u);
      }, 0);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) return "站点暂未开放登录";
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? translateAuthError(error.message) : null;
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, nickname: string): Promise<SignUpResult> => {
      const supabase = getSupabase();
      if (!supabase) return { error: "站点暂未开放注册", needConfirm: false };
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nickname } },
      });
      if (error) return { error: translateAuthError(error.message), needConfirm: false };
      return { error: null, needConfirm: !data.session };
    },
    [],
  );

  const signOut = useCallback(async () => {
    await getSupabase()?.auth.signOut();
  }, []);

  const openAuth = useCallback(() => setAuthOpen(true), []);

  const requireAuth = useCallback(() => {
    if (user) return true;
    setAuthOpen(true);
    return false;
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      configured: isSupabaseConfigured,
      user,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      openAuth,
      requireAuth,
    }),
    [user, profile, loading, signIn, signUp, signOut, openAuth, requireAuth],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        signIn={signIn}
        signUp={signUp}
      />
    </AuthContext.Provider>
  );
}
