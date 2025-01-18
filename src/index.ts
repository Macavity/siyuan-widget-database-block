import Widget from "@/Widget.svelte";
import "siyuan-app/app/appearance/icons/ant/icon";
import "siyuan-app/app/appearance/icons/material/icon";
import "./index.scss";
import { loadI18N } from "@/utils/i18n";

let widgetElement = document.getElementById("widget");
new Widget({
  target: widgetElement,
  props: {
    i18n: loadI18N(),
  },
});
