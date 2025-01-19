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
import { isCollapsed } from "@/stores/widgetStore";
import { get } from "svelte/store";

export const LOCAL_STORAGE = "widget-database-block";
export const WIDGET_SETTING_ATTRIBUTE_NAME = "custom-widget-database-block";

export class SettingsService {
  widgetBlockId: string;
  globalSettings: GlobalSettings | undefined;

  widgetSettings: WidgetSettings | undefined;

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
    isCollapsed.set(this.widgetSettings.isCollapsed);

    if (!this.widgetSettings.targetBlockId) {
      this.widgetSettings.targetBlockId = await getDefaultTargetBlockId(
        this.globalSettings.defaultGetTargetBlockMethod,
      );
    }

    // If the attribute does not exist, it means that it is created for the first time and is not collapsed
    // by default and the configuration is saved.
    if (!currentWidgetSettings) {
      // Delay the save by 0.5 seconds, as the widget may not be indexed yet and a direct save will fail.
      setTimeout(() => {
        this.saveWidgetSettings();
      }, 500);
    }
  }

  async load() {
    await this.loadGlobalSettings();
    await this.loadWidgetSettings();
  }

  async updateWidgetSettings(widgetSettings: Partial<WidgetSettings>) {
    this.widgetSettings = {
      ...this.widgetSettings,
      ...widgetSettings,
    };

    await this.saveWidgetSettings();
  }

  async saveWidgetSettings() {
    // Update values from store
    this.widgetSettings.isCollapsed = get(isCollapsed);

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
