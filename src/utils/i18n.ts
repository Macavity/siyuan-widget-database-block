import enUS from "../../public/i18n/en_US.json";
import zhCN from "../../public/i18n/zh_CN.json";
import { I18N } from "@/types/i18n";
import { getWindowSiyuan } from "@/libs/widget-api";

export function loadI18N(): I18N {
  const lang = getWindowSiyuan().config.lang;
  switch (lang) {
    case "zh_CN":
    case "zh_CHT":
      return zhCN;
    case "en_US":
    default:
      return enUS;
  }
}
