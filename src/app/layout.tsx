import type { Metadata, Viewport } from "next";

import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { stats } from "@/data";

export const metadata: Metadata = {
  title: {
    default: "哲思 · 中西哲学名言精选",
    template: "%s · 哲思",
  },
  description: `收录中国与西方哲学中 ${stats.quotes} 则可考出处的语句，按 ${stats.themes} 个主题编排，涵盖 ${stats.philosophers} 位哲学家。每条标明出处，供随手翻阅。`,
  keywords: [
    "哲学名言",
    "中西哲学",
    "哲学语录",
    "斯多葛",
    "儒家",
    "道家",
    "存在主义",
    "名言出处",
  ],
  authors: [{ name: "哲思" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f3" },
    { media: "(prefers-color-scheme: dark)", color: "#11100e" },
  ],
};

/** 在首屏渲染前决定主题，避免深色模式下的白闪 */
const themeScript = `(function(){try{var s=localStorage.getItem("zhe-theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;if(s==="dark"||(!s&&d)){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen">
        <a
          href="#main"
          className="focus-ring sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:font-sans focus:text-xs focus:text-paper"
        >
          跳到正文
        </a>
        <SiteHeader />
        <main id="main" className="relative z-[1]">
          {children}
        </main>
        <div className="relative z-[1]">
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
