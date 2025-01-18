import { TAVCol } from "siyuan";
import { getColIconByType } from "@/libs/siyuan/protyle/render/av/col";

export const unicode2Emoji = (
  unicode: string,
  className = "",
  needSpan = false,
  lazy = false,
) => {
  if (!unicode) {
    return "";
  }
  let emoji = "";
  if (unicode.indexOf(".") > -1) {
    emoji = `<img class="${className}" ${lazy ? "data-" : ""}src="/emojis/${unicode}"/>`;
  } else {
    try {
      unicode.split("-").forEach((item) => {
        if (item.length < 5) {
          emoji += String.fromCodePoint(parseInt("0" + item, 16));
        } else {
          emoji += String.fromCodePoint(parseInt(item, 16));
        }
      });
      if (needSpan) {
        emoji = `<span class="${className}">${emoji}</span>`;
      }
    } catch {
      // 自定义表情搜索报错 https://github.com/siyuan-note/siyuan/issues/5883
      // 这里忽略错误不做处理
    }
  }
  return emoji;
};

export function getIconHtml(icon: string, type: TAVCol): string {
  let result: string;
  if (icon) {
    result = unicode2Emoji(icon, "block__logoicon custom-emoji", true);
  } else {
    result = `<svg class="block__logoicon"><use xlink:href="#${getColIconByType(type)}"></use></svg>`;
  }

  return result;
}
