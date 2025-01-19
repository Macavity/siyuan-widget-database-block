import { TabType } from "@/types/tab-type";

export class WidgetSettings {
  constructor(
    public columns: number,
    public filterEmpty: boolean,
    public openDocAutoCollapsed: boolean,
    public showBuiltInAttr: boolean,
    public showCustomAttr: boolean,
    public targetBlockId: string = null,
    public lastSelectTabType: TabType = null,
    public lastSelectAvId: string = null,
    public isCollapsed: boolean = false,
  ) {}
}
