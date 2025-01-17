import {TabType} from "@/types/tab-type";
import { GlobalSettings } from "./global-settings";

export class AttrSetting {
    targetBlockId: string;
    lastSelectTabType: TabType;
    lastSelectAvId: string;
    columns: number;
    filterEmpty: boolean;
    openDocAutoCollapsed: boolean;
    showBuiltInAttr: boolean;
    showCustomAttr: boolean;

    constructor(globalSettingDto: GlobalSettings) {
        this.targetBlockId = null;
        this.columns = globalSettingDto.defaultColumns;
        this.filterEmpty = globalSettingDto.defaultFilterEmpty;
        this.openDocAutoCollapsed = globalSettingDto.defaultCollapsed;
        this.showBuiltInAttr = globalSettingDto.defaultShowBuiltInAttr;
        this.showCustomAttr = globalSettingDto.defaultShowCustomAttr;
    }
}