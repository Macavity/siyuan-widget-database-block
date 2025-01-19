import {
  getBlockAttrs,
  getLocalStorage,
  setBlockAttrs,
  setStorageVal,
} from "@/api";
import { getCurrentWidgetId, getDefaultTargetBlockId } from "@/libs/widget-api";
import { WidgetSettings } from "@/module/settings/types/widget-settings";
import { GlobalSettings } from "@/module/settings/types/global-settings";
import { SettingsFactory } from "@/module/settings/settings-factory";

export const LOCAL_STORAGE = "widget-database-block";
export const WIDGET_SETTING_ATTRIBUTE_NAME = "custom-widget-database-block";

export class SettingsService {
  widgetCollapsed: boolean;
  widgetBlockId: string;
  widgetSettings: WidgetSettings;
  globalSettings: GlobalSettings;

  async loadGlobalSettings() {
    const data = await getLocalStorage();
    const currentSettings = data[LOCAL_STORAGE] ?? {};

    this.globalSettings =
      SettingsFactory.createGlobalSettingsFromStorage(currentSettings);
  }

  async loadWidgetSettings() {
    this.widgetBlockId = getCurrentWidgetId();

    const blockAttrMap = await getBlockAttrs(this.widgetBlockId);
    const settingsString = blockAttrMap[WIDGET_SETTING_ATTRIBUTE_NAME];
    const currentWidgetSettings = settingsString
      ? JSON.parse(settingsString)
      : {};

    this.widgetSettings = SettingsFactory.createWidgetSettings(
      this.globalSettings,
      currentWidgetSettings,
    );

    if (!this.widgetSettings.targetBlockId) {
      this.widgetSettings.targetBlockId = await getDefaultTargetBlockId(
        this.globalSettings.defaultGetTargetBlockMethod,
      );
    }

    // If the attribute does not exist, it means that it is created for the first time and is not collapsed
    // by default and the configuration is saved.
    if (currentWidgetSettings) {
      this.widgetCollapsed = this.widgetSettings.openDocAutoCollapsed;
    } else {
      this.widgetCollapsed = false;

      // Delay the save by 0.5 seconds, as the widget may not be indexed yet and a direct save will fail.
      setTimeout(() => {
        this.updateWidgetSettings(this.widgetSettings);
      }, 500);
    }
  }

  async load() {
    await this.loadGlobalSettings();
    await this.loadWidgetSettings();
  }

  async updateWidgetSettings(WidgetSettingDto: WidgetSettings) {
    this.widgetSettings = WidgetSettingDto;

    await setBlockAttrs(this.widgetBlockId, {
      [WIDGET_SETTING_ATTRIBUTE_NAME]: JSON.stringify(this.widgetSettings),
    });
  }

  async updateGlobalSettings(widgetGlobalSettingDto: GlobalSettings) {
    this.globalSettings = widgetGlobalSettingDto;

    await setStorageVal(LOCAL_STORAGE, widgetGlobalSettingDto);
  }
}

export const settingsService = new SettingsService();
