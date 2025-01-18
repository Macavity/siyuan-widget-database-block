import Widget from "@/Widget.svelte";
import "./index.scss";
import { loadI18N } from "@/utils/i18n";

const widgetElement = document.getElementById("widget");
new Widget({
  target: widgetElement,
  props: {
    i18n: loadI18N(),
  },
});
