
let logLevel = 2;
const NAME = "DB";
const PREFIX = "Database Block";

/*
LEVEL 0 Ignore All
LEVEL 1 Only Error
LEVEL 2 Err + Warn
LEVEL 3 Err + Warn + Info
LEVEL 4 Err + Warn + Info + Log
LEVEL 5 Err + Warn + Info + Log + Debug
Please note that adding debug settings under window based on code snippets may not work when the widget is just loaded!
*/
export function commonPushCheck() {
    if (window.top["WidgetLogger"] == undefined || window.top["WidgetLogger"][NAME] == undefined) {
        return logLevel;
    }
    return window.top["WidgetLogger"][NAME];
}

export function isDebugMode() {
    return commonPushCheck() > logLevel;
}

export function debugPush(str: string, ...args: any[]) {
    if (commonPushCheck() >= 5) {
        console.debug(`${PREFIX}[D] ${new Date().toLocaleTimeString()} ${str}`, ...args);
    }
}

export function infoPush(str: string, ...args: any[]) {
    if (commonPushCheck() >= 3) {
        console.info(`${PREFIX}[I] ${new Date().toLocaleTimeString()} ${str}`, ...args);
    }
}

export function logPush(str: string, ...args: any[]) {
    if (commonPushCheck() >= 4) {
        console.log(`${PREFIX}[L] ${new Date().toLocaleTimeString()} ${str}`, ...args);
    }
}

export function errorPush(str: string, ... args: any[]) {
    if (commonPushCheck() >= 1) {
        console.error(`${PREFIX}[E] ${new Date().toLocaleTimeString()} ${str}`, ...args);
        console.trace(args[0] ?? undefined);
    }
}

export function warnPush(str: string, ... args: any[]) {
    if (commonPushCheck() >= 2) {
        console.warn(`${PREFIX}[W] ${new Date().toLocaleTimeString()} ${str}`, ...args);
    }
}