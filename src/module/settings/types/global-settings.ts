import { TargetBlockMethod } from "@/module/settings/types/target-block-method";

export class GlobalSettings {
  constructor(
    public defaultGetTargetBlockMethod: TargetBlockMethod = TargetBlockMethod.RootBlock,
    public defaultColumns: number = 1,
    public defaultFilterEmpty: boolean = false,
    public defaultCollapsed: boolean = false,
    public defaultShowBuiltInAttr: boolean = false,
    public defaultShowCustomAttr: boolean = false,
    public useThirdPartyThemeStyles: boolean = false,
  ) {}
}
