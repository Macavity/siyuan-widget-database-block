import {TargetBlockMethod} from "@/module/settings/types/target-block-method";

export class GlobalSettings {
    defaultGetTargetBlockMethod: TargetBlockMethod;
    defaultColumns: number;
    defaultFilterEmpty: boolean;
    defaultCollapsed: boolean;
    defaultShowBuiltInAttr: boolean;
    defaultShowCustomAttr: boolean;
    useThirdPartyThemeStyles: boolean;

    constructor() {
        this.defaultGetTargetBlockMethod = TargetBlockMethod.RootBlock;
        this.defaultColumns = 1;
        this.defaultFilterEmpty = false;
        this.defaultCollapsed = false;
        this.defaultShowBuiltInAttr = false;
        this.defaultShowCustomAttr = false;
        this.useThirdPartyThemeStyles = false;
    }
}