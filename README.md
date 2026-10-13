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
│   ├── site-header.tsx            # 吸顶导航（含移动端菜单与登录入口）
│   ├── site-footer.tsx
│   ├── theme-toggle.tsx           # 深浅色切换（localStorage + 防白闪）
│   ├── featured-quote.tsx         # 首页「今日一则」（确定性子 + 换一则 + 复制）
│   ├── random-quote.tsx           # 随机展示
│   ├── quote-browser.tsx          # 名言页的筛选 / 搜索逻辑
│   ├── quote-card.tsx             # QuoteCard（网格）+ QuoteRow（长列表），内嵌互动栏
│   ├── quote-actions.tsx          # 点赞 / 收藏 / 转发 / 评论入口
│   ├── comments.tsx               # 评论区（公开可读，登录可发，本人可删）
│   ├── auth-modal.tsx             # 登录 / 注册弹窗
│   ├── user-menu.tsx              # 顶栏账户菜单（收藏页入口、退出）
│   ├── favorites-list.tsx         # 「我的收藏」列表
│   ├── theme-icon.tsx             # 主题 → lucide 图标映射
│   └── ui.tsx                     # PageHeader / SectionHeading / Tag / Ornament
├── data/
│   ├── types.ts                   # 数据结构定义
│   ├── themes.ts                  # 12 个主题
│   ├── philosophers.ts            # 55 位哲学家
│   ├── quotes.ts                  # 全部引文
│   └── index.ts                   # 派生统计与检索函数
├── lib/
│   ├── utils.ts                   # cn / 稳定哈希 / 按日取模
│   ├── supabase.ts                # Supabase 浏览器端单例（未配置时返回 null）
│   └── auth.tsx                   # AuthProvider：会话、资料、登录弹窗入口
└── app/favorites/page.tsx         # 我的收藏
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
| 交互 | 阅读部分仅 4 个客户端组件（导航、主题切换、名言筛选、随机展示）；用户系统（登录、点赞、收藏、评论）为可选的客户端交互 |
| 追踪 | 无统计脚本、无 Cookie；仅当配置 Supabase 后会与其 API 通信 |

### 关于 URL 结尾的斜杠

`next.config.ts` 中开启了 `trailingSlash: true`，导出产物为 `quotes/index.html` 这样的目录结构，
对任意静态服务器和本地双击打开都更稳妥。**新增站内链接时请统一以 `/` 结尾**（如 `/quotes/`），
否则在部分静态托管上会出现 404。

---

## 用户系统（可选 · Supabase）

登录、收藏、点赞、评论、转发依赖 Supabase（Auth + Postgres + RLS），**不配置时整站自动退化为纯阅读站**，构建与部署都不需要任何环境变量。

开启步骤：

1. 在 [supabase.com](https://supabase.com) 创建项目（区域建议 Singapore / Tokyo）。
2. 打开项目的 **SQL Editor**，整段执行 [`supabase/schema.sql`](supabase/schema.sql)（建表 + 触发器 + RLS 策略，幂等可重复执行）。
3. **Authentication → Sign In / Providers** 确认 Email 已开启；测试期可关闭 "Confirm email"。
4. 复制 `.env.local.example` 为 `.env.local`，填入 **Project Settings → API** 里的 `Project URL` 与 `anon public` key。
5. `pnpm dev` 即可看到顶栏的「登录」入口与名言卡片下的互动栏。

> `anon` key 是设计为公开的前端密钥，数据安全由 schema.sql 里的 RLS 策略保证；
> `service_role` key 永远不要出现在前端。部署到托管平台时，把同两个变量配到平台的环境变量里即可（构建期内联）。

---

## 部署

```bash
pnpm build
# 把 out/ 整个目录上传即可，无需 Node 运行时
```

无服务器、无构建期网络请求；环境变量仅在开启用户系统时需要（见上一节），未配置时产物为纯静态阅读站。

> 仓库以 pnpm 为准（`packageManager` 字段），CI 依赖 `pnpm-lock.yaml`。改动依赖后请提交新的
> `pnpm-lock.yaml`，否则部署会因 `--frozen-lockfile` 校验失败。

### 自动发布（GitHub Pages）

`.github/workflows/deploy.yml` 会在每次 push 到 `master`（或手动 `workflow_dispatch`）时：
`pnpm install` → `pnpm typecheck` → `pnpm build` → 发布到 GitHub Pages。

工作流会先调用 REST API 幂等地确认 Pages 已启用且 **Source = GitHub Actions**，未启用时自动开启，
因此正常情况下无需手工配置。若自动开启失败（token 权限不足），按日志提示处理：

1. **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**；
2. **Settings → Actions → General → Workflow permissions** 选 **Read and write permissions**。

`actions/configure-pages` / `actions/deploy-pages` 在 Pages 未启用时会因
`GET /repos/{owner}/{repo}/pages` 返回 404 而报 `HttpError: Not Found`，上面这步就是为此加的兜底。
部署成功后地址会出现在 `Deploy to GitHub Pages` 环境里。

部署到项目页（`https://<user>.github.io/philosophical_quotes/`）时，工作流会自动传入
`NEXT_PUBLIC_BASE_PATH=/philosophical_quotes`，`next.config.ts` 据此设置 `basePath`，
站内所有 `next/link` 与静态资源路径都会带上前缀；本地开发与部署到根域名时无需该变量。
