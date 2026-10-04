import type { Metadata } from "next";
import Link from "next/link";

import { Ornament, PageHeader } from "@/components/ui";
import { quotes, stats } from "@/data";

export const metadata: Metadata = {
  title: "关于本站",
  description: "编辑原则、引文来源与分类说明。",
};

const PRINCIPLES = [
  {
    title: "只收可考出处的句子",
    body: "每条引文都标注到篇名一级（中文经典到篇章，西方著作到书名、卷次或节次）。宁缺毋滥：拿不准来源的、只在网络上流传而无实据的，一律不收。",
  },
  {
    title: "区分「原句」与「后世概括」",
    body: "有些流传甚广的说法并非原话，而是后人的提炼。这类条目会在编者按中注明「常引」「意旨」或「撮述其意」，不伪装成原文。",
  },
  {
    title: "译文以通行中译为准",
    body: "西方引文不做逐字直译，取通行译本的语感，必要时调整标点与语序，使之在中文里仍然站得住。若需学术引用，请回到原著与权威译本。",
  },
  {
    title: "分类只是手段",
    body: "十二个主题之间有大量重叠，同一句话可能同时属于「时间」与「生死」。分类的目的不是划界，而是给读者一条进入的路径。",
  },
  {
    title: "不作结论",
    body: "本站把互相冲突的观点并列陈列——斯多葛要你接受命运，庄子要你超脱是非，尼采要你重估一切。选择哪一条，是读者自己的事。",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-shell px-5 sm:px-8">
      <PageHeader
        breadcrumb={[{ label: "首页", href: "/" }, { label: "关于" }]}
        title="关于本站"
        lede="一个不做搜索排名、不做推荐算法、不要求登录的静态阅读项目。它的全部野心，是让这些句子被安静地读完。"
      />

      <div className="grid gap-14 py-16 lg:grid-cols-[1fr_18rem] lg:gap-20">
        <div>
          <section>
            <h2 className="eyebrow">编辑原则</h2>
            <ol className="mt-8 space-y-9">
              {PRINCIPLES.map((p, i) => (
                <li key={p.title} className="grid grid-cols-[2rem_1fr] gap-x-4">
                  <span className="pt-1 font-mono text-2xs tabular-nums text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg text-ink">{p.title}</h3>
                    <p className="mt-3 font-serif text-sm leading-7 text-ink-soft">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <Ornament className="my-16" />

          <section>
            <h2 className="eyebrow">主要取材</h2>
            <p className="mt-6 font-serif text-sm leading-8 text-ink-soft">
              中文部分以传世经典的通行整理本为主：《论语》《道德经》《庄子》《孟子》《荀子》
              《墨子》《韩非子》《列子》《坛经》《朱子语类》《传习录》《日知录》等；
              诗文类取自《陶渊明集》《李太白集》《杜工部集》《东坡七集》及《古文观止》系统。
              西方部分参考柏拉图对话录、亚里士多德《尼各马可伦理学》、斯多葛诸家的书信与语录、
              《思想录》《伦理学》《纯粹理性批判》《查拉图斯特拉如是说》《西西弗神话》等原著的中译本。
            </p>
            <p className="mt-5 font-serif text-sm leading-8 text-ink-muted">
              本站不提供原始文献的全文，也不替代任何学术版本。若发现某条引文的出处标注有误，
              欢迎据实指出——这类错误比缺漏更值得优先修正。
            </p>
          </section>

          <Ornament className="my-16" />

          <section>
            <h2 className="eyebrow">技术说明</h2>
            <dl className="mt-8 divide-y divide-line-soft border-y border-line-soft">
              {[
                ["技术栈", "Next.js（静态导出）· React · TypeScript · Tailwind CSS"],
                ["字体", "系统衬线字体栈（宋体 / Songti SC 优先），无外部字体请求"],
                ["主题", "浅色纸面为默认，可切换深色；偏好保存在本地"],
                ["数据", "全部引文以 TypeScript 数据文件形式随站点一同发布"],
                ["追踪", "无统计脚本、无 Cookie、无第三方请求"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[6rem_1fr] gap-6 py-4">
                  <dt className="font-sans text-2xs tracking-wider text-ink-faint">{k}</dt>
                  <dd className="font-serif text-sm leading-6 text-ink-soft">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <Ornament className="my-16" />

          <section>
            <h2 className="eyebrow">使用</h2>
            <p className="mt-6 font-serif text-sm leading-8 text-ink-soft">
              引文本身属于公共领域或合理引用范畴，可自由复制、引用（建议同时核对原始出处）。
              站点的排版与设计可以借用，但请勿原样搬运为一个新的「名言站」。
            </p>
          </section>
        </div>

        {/* 侧栏 */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-line-soft bg-surface p-6 shadow-card">
            <h2 className="eyebrow">一览</h2>
            <dl className="mt-6 space-y-4">
              {[
                ["引文", stats.quotes],
                ["哲学家", stats.philosophers],
                ["其中中国", stats.cn],
                ["其中西方", stats.west],
                ["主题", stats.themes],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex items-baseline justify-between gap-4">
                  <dt className="font-sans text-xs text-ink-muted">{k}</dt>
                  <dd className="font-serif text-lg tabular-nums text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 border-t border-line-soft pt-4 font-sans text-2xs leading-5 text-ink-faint">
              数据截至本站构建时。新增引文会同步更新此处的计数。
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/quotes/"
              className="focus-ring rounded-full bg-ink px-5 py-3 text-center font-sans text-xs tracking-wider text-paper transition-opacity hover:opacity-90"
            >
              开始阅读（{quotes.length} 则）
            </Link>
            <Link
              href="/themes/"
              className="focus-ring rounded-full border border-line px-5 py-3 text-center font-sans text-xs tracking-wider text-ink-muted transition-colors hover:border-accent/50 hover:text-accent"
            >
              按主题浏览
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
