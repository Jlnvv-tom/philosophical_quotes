"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "首页" },
  { href: "/quotes/", label: "名言" },
  { href: "/philosophers/", label: "哲学家" },
  { href: "/themes/", label: "主题" },
  { href: "/random/", label: "随手一则" },
  { href: "/about/", label: "关于" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line-soft bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-shell items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="focus-ring group flex items-center gap-3 rounded-sm">
          <span className="grid h-9 w-9 place-items-center border border-line bg-surface font-serif text-base text-ink transition-colors duration-300 group-hover:border-accent/50 group-hover:text-accent">
            哲
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-serif text-base tracking-[0.32em] text-ink">哲思</span>
            <span className="mt-1 font-sans text-[0.5625rem] uppercase tracking-[0.26em] text-ink-faint">
              Philosophia
            </span>
          </span>
        </Link>

        <nav className="hidden items-center md:flex" aria-label="主导航">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "focus-ring relative px-3 py-2 font-sans text-xs tracking-wider transition-colors duration-300",
                  active ? "text-ink" : "text-ink-muted hover:text-ink",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-3 bottom-0.5 h-px origin-left bg-accent transition-transform duration-300",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "收起菜单" : "展开菜单"}
            aria-expanded={open}
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-soft text-ink-muted transition-colors hover:border-line hover:text-ink md:hidden"
          >
            {open ? (
              <X className="h-4 w-4" strokeWidth={1.4} />
            ) : (
              <Menu className="h-4 w-4" strokeWidth={1.4} />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="animate-fade-in border-t border-line-soft bg-paper md:hidden"
          aria-label="移动端导航"
        >
          <div className="mx-auto max-w-shell px-5 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "focus-ring flex items-center justify-between rounded-md px-2 py-3 font-sans text-sm transition-colors",
                  isActive(item.href) ? "text-accent" : "text-ink-soft hover:text-ink",
                )}
              >
                {item.label}
                <span className="font-mono text-2xs text-ink-faint">
                  {isActive(item.href) ? "●" : ""}
                </span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
