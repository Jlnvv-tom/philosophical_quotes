# 哲思 · 中西哲学名言精选

一个静态的哲学名言阅读站。收录中国与西方哲学中 **可考出处** 的语句，按 **12 个主题** 编排，涵盖 **55 位哲学家**。

设计取向是「极简学术 · 衬线排版」：米白纸面、墨色文字、朱砂点缀，大量留白，不打扰阅读。

---

## 快速开始

```bash
pnpm install        # 或 npm install
pnpm dev            # 开发服务器 → http://localhost:3000
pnpm build          # 静态导出 → out/
pnpm typecheck      # 类型检查
```

`pnpm build` 使用 Next.js 的 `output: "export"`，产物是纯静态文件，放在 `out/` 目录。
可以直接双击 `out/index.html` 打开，也可以丢到任意静态托管（EdgeOne Pages / Vercel / GitHub Pages / Nginx / OSS…）。

---

## 目录结构

```
src/
├── app/
│   ├── layout.tsx                 # 全站骨架：字体、主题脚本、页头页脚
│   ├── page.tsx                   # 首页：主题 / 精选 / 中西对照 / 群像
│   ├── globals.css                # 设计令牌（颜色、字体、纹理）
│   ├── quotes/page.tsx            # 全部名言（客户端筛选 + 搜索）
│   ├── philosophers/
│   │   ├── page.tsx               # 哲学家总览（按传统分组）
│   │   └── [slug]/page.tsx        # 哲学家详情：小传 + 全部引文
│   ├── themes/
│   │   ├── page.tsx               # 主题总览
│   │   └── [slug]/page.tsx        # 主题详情：中国 / 西方对照
│   ├── random/page.tsx            # 随手一则
│   ├── about/page.tsx             # 编辑原则与来源说明
│   └── not-found.tsx              # 404
├── components/
│   ├── site-header.tsx            # 吸顶导航（含移动端菜单）
│   ├── site-footer.tsx
│   ├── theme-toggle.tsx           # 深浅色切换（localStorage + 防白闪）
│   ├── featured-quote.tsx         # 首页「今日一则」（确定性子 + 换一则 + 复制）
│   ├── random-quote.tsx           # 随机展示
│   ├── quote-browser.tsx          # 名言页的筛选 / 搜索逻辑
│   ├── quote-card.tsx             # QuoteCard（网格）+ QuoteRow（长列表）
│   ├── theme-icon.tsx             # 主题 → lucide 图标映射
│   └── ui.tsx                     # PageHeader / SectionHeading / Tag / Ornament
├── data/
│   ├── types.ts                   # 数据结构定义
│   ├── themes.ts                  # 12 个主题
│   ├── philosophers.ts            # 55 位哲学家
│   ├── quotes.ts                  # 全部引文
│   └── index.ts                   # 派生统计与检索函数
└── lib/utils.ts                   # cn / 稳定哈希 / 按日取模
```

---

## 内容维护

全部内容都是纯 TypeScript 数据，改完即生效，不需要数据库或 CMS。

### 新增一则引文

在 `src/data/quotes.ts` 里追加：

```ts
{
  id: "q191",                       // 唯一，建议递增
  text: "……",
  author: "kongzi",                 // 必须是 philosophers.ts 里的 slug
  source: "《论语 · 子罕》",          // 精确到篇名
  themes: ["time", "action"],       // 必须是 themes.ts 里的 slug
  note: "可选的编者按",              // 用于解释语境或标注「常引/意旨」
}
```

### 新增一位哲学家

在 `src/data/philosophers.ts` 里追加，字段见 `src/data/types.ts` 的 `Philosopher` 接口。
`slug` 一旦确定就不要改——它会成为 URL（`/philosophers/<slug>/`）。

### 编辑原则（重要）

1. **只收可考出处的句子**，出处精确到篇名 / 书名。
2. **区分原句与后世概括**。凡属提炼、题旨或习见引述者，在 `note` 里注明「常引」「意旨」「撮述其意」，不伪装成原文。
3. **译文以通行中译为准**，不做逐字直译。若需学术引用，请回到原著。

---

## 技术说明

| 项目 | 说明 |
| --- | --- |
| 框架 | Next.js 15 App Router，`output: "export"` 纯静态导出 |
| 样式 | Tailwind CSS 3.4 + CSS 变量驱动主题（颜色全部来自 `globals.css` 的 RGB 三元组） |
| 字体 | 系统衬线字体栈（`Songti SC` / `Source Han Serif SC` / `Noto Serif SC` 优先），**零外部字体请求** |
| 主题 | 浅色纸面为默认，`class` 策略切深色；首屏由内联脚本读取 localStorage，无白闪 |
| 交互 | 仅 4 个客户端组件（导航、主题切换、名言筛选、随机展示），其余全部服务端渲染 |
| 追踪 | 无统计脚本、无 Cookie、无第三方请求 |

### 关于 URL 结尾的斜杠

`next.config.ts` 中开启了 `trailingSlash: true`，导出产物为 `quotes/index.html` 这样的目录结构，
对任意静态服务器和本地双击打开都更稳妥。**新增站内链接时请统一以 `/` 结尾**（如 `/quotes/`），
否则在部分静态托管上会出现 404。

---

## 部署

```bash
pnpm build
# 把 out/ 整个目录上传即可，无需 Node 运行时
```

无服务器、无环境变量、无构建期网络请求。
