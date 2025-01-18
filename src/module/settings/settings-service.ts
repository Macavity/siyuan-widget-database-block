import {
  getBlockAttrs,
  getLocalStorage,
  setBlockAttrs,
  setStorageVal,
} from "@/api";
import { getCurrentWidgetId, getDefaultTargetBlockId } from "@/libs/widget-api";
import { AttrSetting } from "@/module/settings/types/attr-setting";
import { GlobalSettings } from "@/module/settings/types/global-settings";

export const LOCAL_STORAGE = "widget-database-block";
export const WIDGET_SETTING_ATTRIBUTE_NAME =
  "custom-widget-database-view-setting";

export class SettingsService {
  widgetCollapsed: boolean;
  widgetBlockId: string;
  widgetSettings: AttrSetting;
  globalSettings: GlobalSettings;

  async load() {
    try {
      this.globalSettings = new GlobalSettings();
      const data = await getLocalStorage();
      // logPush("getLocalStorage", data);
      const globalSettingDtoNew = data[LOCAL_STORAGE];
      if (globalSettingDtoNew) {
        this.globalSettings = {
          ...this.globalSettings,
          ...globalSettingDtoNew,
        };
      }
    } catch {
      /* empty */
    }

    try {
      this.widgetSettings = new AttrSetting(this.globalSettings);

      this.widgetBlockId = getCurrentWidgetId();

      const blockAttrMap = await getBlockAttrs(this.widgetBlockId);
      const settings = blockAttrMap[WIDGET_SETTING_ATTRIBUTE_NAME];
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
      // If the attribute does not exist, it means that it is created for the first time and is not collapsed
      // by default and the configuration is saved.
      if (settings) {
        this.widgetCollapsed = this.widgetSettings.openDocAutoCollapsed;
      } else {
        this.widgetCollapsed = false;
        // Delay the save by 0.5 seconds, as the pendant may not be indexed yet and a direct save will fail.
        setTimeout(() => {
          this.update(this.widgetSettings);
        }, 500);
      }
    } catch {
      /* empty */
    }
  }

  async update(WidgetSettingDto: AttrSetting) {
    this.widgetSettings = WidgetSettingDto;

    await setBlockAttrs(this.widgetBlockId, {
      [WIDGET_SETTING_ATTRIBUTE_NAME]: JSON.stringify(this.widgetSettings),
    });
  }

  async updateLocalStorage(widgetGlobalSettingDto: GlobalSettings) {
    this.globalSettings = widgetGlobalSettingDto;

    await setStorageVal(LOCAL_STORAGE, widgetGlobalSettingDto);
  }
}

export const settingsService = new SettingsService();
