/*
 * Copyright (c) 2024 by frostime. All Rights Reserved.
 * @Author       : frostime
 * @Date         : 2024-04-19 18:30:12
 * @FilePath     : /src/libs/index.d.ts
 * @LastEditTime : 2024-04-30 16:39:54
 * @Description  :
 */
type TSettingItemType =
  | "checkbox"
  | "select"
  | "textinput"
  | "textarea"
  | "number"
  | "slider"
  | "button"
  | "hint"
  | "custom";

interface ISettingItemCore {
  type: TSettingItemType;
  key: string;
  value: unknown;
  placeholder?: string;
  slider?: {
    min: number;
    max: number;
    step: number;
  };
  options?: { [key: string | number]: string };
  button?: {
    label: string;
    callback: () => void;
  };
}

export interface ISettingItem extends ISettingItemCore {
  title: string;
  description: string;
  direction?: "row" | "column";
}

//Interface for setting-utils
interface ISettingUtilsItem extends ISettingItem {
  action?: {
    callback: () => void;
  };
  createElement?: (currentVal: unknown) => HTMLElement;
  getEleVal?: (ele: HTMLElement) => unknown;
  setEleVal?: (ele: HTMLElement, val: unknown) => void;
}
