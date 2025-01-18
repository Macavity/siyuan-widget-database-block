import {
  getBlockAttrs,
  getLocalStorage,
  setBlockAttrs,
  setStorageVal,
} from "@/api";
import { getCurrentWidgetId, getDefaultTargetBlockId } from "@/libs/widget-api";
import { AttrSetting } from "@/module/settings/types/attr-setting";
import { GlobalSettings } from "@/module/settings/types/global-settings";
import { logPush } from "@/utils/logger";

export const LOCAL_STORAGE = "widget-database-block";
export const WIDGET_SETTING_ATTRIBUTE_NAME =
  "custom-widget-database-view-setting";

export class SettingsService {
  widgetCollapsed: boolean;
  widgetBlockId: string;
  widgetBlockInfo: Block;
  widgetSettings: AttrSetting;
  globalSettings: GlobalSettings;

  async load() {
    try {
      this.globalSettings = new GlobalSettings();
      let data = await getLocalStorage();
      logPush("getLocalStorage", data);
      let globalSettingDtoNew = data[LOCAL_STORAGE];
      if (globalSettingDtoNew) {
        this.globalSettings = {
          ...this.globalSettings,
          ...globalSettingDtoNew,
        };
      }
    } catch (e) {}

    try {
      this.widgetSettings = new AttrSetting(this.globalSettings);

      this.widgetBlockId = getCurrentWidgetId();

      let blockAttrMap = await getBlockAttrs(this.widgetBlockId);
      let settings = blockAttrMap[WIDGET_SETTING_ATTRIBUTE_NAME];
      if (settings) {
        this.widgetSettings = {
          ...this.widgetSettings,
          ...JSON.parse(settings),
        };
      }
      if (!this.widgetSettings.targetBlockId) {
        this.widgetSettings.targetBlockId = await getDefaultTargetBlockId(
          this.globalSettings.defaultGetTargetBlockMethod,
        );
      }
      // 如果不存在属性，说明是第一次创建，默认不折叠，并保存配置。
      if (settings) {
        this.widgetCollapsed = this.widgetSettings.openDocAutoCollapsed;
      } else {
        this.widgetCollapsed = false;
        // Delay the save by 0.5 seconds, as the pendant may not be indexed yet and a direct save will fail.
        setTimeout(() => {
          this.update(this.widgetSettings);
        }, 500);
      }
    } catch (e) {}
  }

  async update(WidgetSettingDto: AttrSetting) {
    this.widgetSettings = WidgetSettingDto;

    let settringDtoStr = JSON.stringify(this.widgetSettings);
    let attrsParam = { [WIDGET_SETTING_ATTRIBUTE_NAME]: settringDtoStr };

    await setBlockAttrs(this.widgetBlockId, attrsParam);
  }

  async updateLocalStorage(widgetGlobalSettingDto: GlobalSettings) {
    this.globalSettings = widgetGlobalSettingDto;

    await setStorageVal(LOCAL_STORAGE, widgetGlobalSettingDto);
  }
}

export const settingsService = new SettingsService();
