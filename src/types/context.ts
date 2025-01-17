import { I18N } from "./i18n";

export enum Context {
  I18N = "i18n",
}

declare module "svelte" {
  // Define overloaded signatures
  export function getContext(context: Context.I18N): I18N;
}
