import { getBlockAttrs, getLocalStorage } from "@/api";
import { getCurrentWidgetId, getDefaultTargetBlockId } from "@/libs/widget-api";
import { AttrSetting } from "@/module/settings/types/attr-setting";
import { GlobalSettings } from "@/module/settings/types/global-settings";
import {
  LOCAL_STORAGE,
  WIDGET_SETTING_ATTRIBUTE_NAME,
} from "@/module/settings/settings-service";

export class SettingsFactory {
  static async createSettings(): Promise<{
    widgetSettings: AttrSetting;
    globalSettings: GlobalSettings;
    widgetBlockId: string;
  }> {
    const globalSettings = new GlobalSettings();
    const data = await getLocalStorage();
    const globalSettingDtoNew = data[LOCAL_STORAGE];
    if (globalSettingDtoNew) {
      Object.assign(globalSettings, globalSettingDtoNew);
    }

    const widgetSettings = new AttrSetting(globalSettings);
    const widgetBlockId = getCurrentWidgetId();
    const blockAttrMap = await getBlockAttrs(widgetBlockId);
    const settings = blockAttrMap[WIDGET_SETTING_ATTRIBUTE_NAME];
    if (settings) {
      Object.assign(widgetSettings, JSON.parse(settings));
    }
    if (!widgetSettings.targetBlockId) {
      widgetSettings.targetBlockId = await getDefaultTargetBlockId(
        globalSettings.defaultGetTargetBlockMethod,
      );
    }

    return { widgetSettings, globalSettings, widgetBlockId };
  }
}
