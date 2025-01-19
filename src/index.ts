import Widget from "@/Widget.svelte";
import "./index.scss";
import { loadI18N } from "@/utils/i18n";
import { settingsService } from "@/module/settings/settings-service";
import { updateFrameHeight } from "@/utils/htmlUtil";

const widgetElement = document.getElementById("widget");
settingsService.load().then(() => {
  new Widget({
    target: widgetElement,
    props: {
      i18n: loadI18N(),
    },
  });
  updateFrameHeight();
});
