export type Tradition = "cn" | "west";

export interface Theme {
  slug: string;
  name: string;
  nameEn: string;
  /** 一句话释义 */
  gloss: string;
  /** 导读：2–4 句 */
  intro: string;
  /** lucide 图标名 */
  icon: string;
  /** 该主题的追问，展示在主题页头部 */
  questions: string[];
  accent: "accent" | "jade";
}

export interface Philosopher {
  slug: string;
  /** 中文名 */
  name: string;
  /** 西文原名 / 字号 */
  nameOriginal: string;
  tradition: Tradition;
  /** 时代标签，如「先秦」「古希腊」 */
  era: string;
  /** 学派，如「道家」「斯多葛学派」 */
  school: string;
  /** 生卒年 */
  years: string;
  /** 一句定位 */
  tagline: string;
  /** 小传：2–4 句 */
  bio: string;
  /** 代表作 */
  works: string[];
}

export interface Quote {
  id: string;
  /** 引文正文 */
  text: string;
  /** 作者 slug；佚名/经典可直接归到最相关者 */
  author: string;
  /** 出处 */
  source: string;
  /** 所属主题 slug（1–3 个） */
  themes: string[];
  /** 编者按：可选，解释或延伸 */
  note?: string;
}
