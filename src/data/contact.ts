import type { QrItem } from "@/components/qr-gallery";

/** 页脚与「关于作者」共用的联络二维码 */
export const contactQrItems: QrItem[] = [
  {
    src: "/images/wechat-personal.jpg",
    alt: "作者微信二维码",
    label: "作者微信",
    hint: "添加时请说明来意",
  },
  {
    src: "/images/wechat-group.png",
    alt: "读者群二维码（怕浪猫 AI）",
    label: "读者群",
    hint: "群二维码有期限，失效可加作者微信",
  },
];
