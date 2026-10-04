"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const STORAGE_KEY = "zhe-theme";

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* 隐私模式下忽略 */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "切换到浅色" : "切换到深色"}
      title={dark ? "切换到浅色" : "切换到深色"}
      className={cn(
        "focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-soft text-ink-muted transition-colors duration-300 hover:border-line hover:text-ink",
        className,
      )}
    >
      {/* 未挂载前固定渲染 Sun，避免 hydration 抖动 */}
      {mounted && dark ? (
        <Sun className="h-4 w-4" strokeWidth={1.4} />
      ) : (
        <Moon className="h-4 w-4" strokeWidth={1.4} />
      )}
    </button>
  );
}
