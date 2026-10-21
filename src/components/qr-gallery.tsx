"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { assetPath } from "@/lib/asset";
import { cn } from "@/lib/utils";

export type QrItem = {
  /** public/ 下的路径，如 /images/wechat-personal.jpg */
  src: string;
  alt: string;
  /** 缩略图下方的短标签 */
  label: string;
  /** 弹窗里补充的一句说明 */
  hint?: string;
};

/** 缩略图 + 点击放大的弹窗；同一组里一次只开一个 */
export function QrGallery({
  items,
  thumbSize = "sm",
  className,
}: {
  items: QrItem[];
  thumbSize?: "sm" | "md";
  className?: string;
}) {
  const [active, setActive] = useState<QrItem | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    const prevOverflow = document.body.style.overflow;

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [active]);

  return (
    <>
      <div className={cn("flex flex-wrap items-start gap-5", className)}>
        {items.map((item) => (
          <button
            key={item.src}
            type="button"
            onClick={(event) => {
              triggerRef.current = event.currentTarget;
              setActive(item);
            }}
            aria-label={`放大查看：${item.label}`}
            aria-haspopup="dialog"
            className="focus-ring group flex flex-col items-center gap-2 rounded-md p-1 transition-colors hover:bg-sunk"
          >
            <span
              className={cn(
                "block overflow-hidden rounded-sm border border-line bg-white p-1.5 shadow-card transition-transform duration-300 group-hover:-translate-y-0.5",
                thumbSize === "md" ? "h-32 w-32" : "h-24 w-24",
              )}
            >
              <img
                src={assetPath(item.src)}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </span>
            <span className="font-sans text-2xs tracking-wider text-ink-faint transition-colors group-hover:text-ink-muted">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div
          role="presentation"
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${active.label}二维码`}
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[92vh] max-w-[92vw] overflow-y-auto rounded-lg border border-line bg-paper p-4 pt-12 shadow-lift"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={() => setActive(null)}
              aria-label="关闭"
              className="focus-ring absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full text-ink-muted transition-colors hover:bg-sunk hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
            <img
              src={assetPath(active.src)}
              alt={active.alt}
              className="mx-auto block h-auto max-h-[74vh] w-auto max-w-full rounded-sm bg-white"
            />
            <p className="mt-3 text-center font-sans text-2xs leading-5 tracking-wider text-ink-muted">
              {active.label}
              {active.hint ? ` · ${active.hint}` : ""}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
