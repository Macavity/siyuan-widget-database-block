import { GlobalSettings } from "@/module/settings/types/global-settings";
import { WidgetSettings } from "@/module/settings/types/widget-settings";

export class SettingsFactory {
  static createGlobalSettingsFromStorage(
    storageData: Partial<GlobalSettings>,
  ): GlobalSettings {
    return new GlobalSettings(
      storageData.defaultGetTargetBlockMethod,
      storageData.defaultColumns,
      storageData.defaultFilterEmpty,
      storageData.defaultCollapsed,
      storageData.defaultShowBuiltInAttr,
      storageData.defaultShowCustomAttr,
      storageData.useThirdPartyThemeStyles,
    );
  }

  static createWidgetSettings(
    globalSettings: GlobalSettings,
    widgetSettingsPartial: Partial<WidgetSettings>,
  ): WidgetSettings {
    return new WidgetSettings(
      widgetSettingsPartial.columns ?? globalSettings.defaultColumns,
      widgetSettingsPartial.filterEmpty ?? globalSettings.defaultFilterEmpty,
      widgetSettingsPartial.openDocAutoCollapsed ??
        globalSettings.defaultCollapsed,
      widgetSettingsPartial.showBuiltInAttr ??
        globalSettings.defaultShowBuiltInAttr,
      widgetSettingsPartial.showCustomAttr ??
        globalSettings.defaultShowCustomAttr,
      widgetSettingsPartial.targetBlockId,
      widgetSettingsPartial.lastSelectTabType,
      widgetSettingsPartial.lastSelectAvId,
      widgetSettingsPartial.isCollapsed,
    );
  }
}
