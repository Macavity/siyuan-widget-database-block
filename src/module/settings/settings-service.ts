import {getBlockAttrs, getLocalStorage, setBlockAttrs, setStorageVal} from "@/api";
import {getCurrentWidgetId, getDefaultTargetBlockId} from "@/libs/widget-api";
import {AttrSetting} from "@/module/settings/types/attr-setting";
import {GlobalSettings} from "@/module/settings/types/global-settings";

export const LOCAL_STORAGE = "widget-database-block"
export const WIDGET_SETTING_ATTRIBUTE_NAME = "custom-widget-database-view-setting"

export class SettingsService {

    widgetCollapsed: boolean;
    widgetBlockId: string;
    widgetBlockInfo: Block;
    widgetSettingDto: AttrSetting;
    widgetGlobalSettingDto: GlobalSettings;

    async load() {
        try {
            this.widgetGlobalSettingDto = new GlobalSettings()
            let data = await getLocalStorage();
            let globalSettingDtoNew = data[LOCAL_STORAGE];
            if (globalSettingDtoNew) {
                this.widgetGlobalSettingDto = {...this.widgetGlobalSettingDto, ...globalSettingDtoNew};
            }

        } catch (e) {

        }

        try {
            this.widgetSettingDto = new AttrSetting(
                this.widgetGlobalSettingDto
            );

            this.widgetBlockId = getCurrentWidgetId();

            let blockAttrMap = await getBlockAttrs(this.widgetBlockId);
            let settringDtoStr = blockAttrMap[WIDGET_SETTING_ATTRIBUTE_NAME];
            if (settringDtoStr) {
                this.widgetSettingDto = {...this.widgetSettingDto, ...JSON.parse(settringDtoStr)};
            }
            if (!this.widgetSettingDto.targetBlockId) {
                let targetBlockId = await getDefaultTargetBlockId(this.widgetGlobalSettingDto.defaultGetTargetBlockMethod);
                this.widgetSettingDto.targetBlockId = targetBlockId;
            }
            // 如果不存在属性，说明是第一次创建，默认不折叠，并保存配置。
            if (settringDtoStr) {
                this.widgetCollapsed = this.widgetSettingDto.openDocAutoCollapsed;
            } else {
                this.widgetCollapsed = false;
                // 延迟0.5秒保存，因为挂件可能还没被索引，直接保存会失败。
                setTimeout(() => {
                    this.update(this.widgetSettingDto);
                }, 500);
            }
        } catch (e) {

        }

    }

    async update(WidgetSettingDto: AttrSetting) {
        this.widgetSettingDto = WidgetSettingDto;

        let settringDtoStr = JSON.stringify(this.widgetSettingDto);
        let attrsParam = {[WIDGET_SETTING_ATTRIBUTE_NAME]: settringDtoStr};

        setBlockAttrs(this.widgetBlockId, attrsParam)

    }

    async updateLocalStorage(widgetGlobalSettingDto: GlobalSettings) {
        this.widgetGlobalSettingDto = widgetGlobalSettingDto;

        setStorageVal(LOCAL_STORAGE, widgetGlobalSettingDto);
    }

}

export const settingsService = new SettingsService();