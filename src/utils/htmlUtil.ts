import {settingsService} from "@/module/settings/settings-service";

export function getRenderedTextFromString(htmlString: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const renderedText = doc.body.innerText;
    return renderedText;
}

export function getInputValueFromString(htmlString: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    let inputCollection = doc.getElementsByTagName("input");
    if (inputCollection && inputCollection.length > 0) {
        return inputCollection[0].value;
    }
    return null;
}

export function refreshCssLink() {
    let head = document.getElementsByTagName("head")[0];

    let linkList = window.parent.document.getElementsByTagName("link"); //获取父窗口link标签对象列表
    const indexStylesheetLink = head.querySelector('link[href="index.css"]');

    for (let i = 0; i < linkList.length; i++) {
        let curLink = linkList[i];
        if (curLink.getAttribute("rel") != "stylesheet") {
            continue;
        }
        try {
            let curLinkHref = formatCssLink(curLink.href);
            if (!isValidLink(curLinkHref)) {
                continue;
            }

            // 检查是否已经存在相同href的<link>标签
            if (isLinkExists(curLink)) {
                continue;
            }

            let _link = document.createElement("link");
            _link.rel = "stylesheet";
            _link.type = "text/css";
            _link.href = curLinkHref;

            head.insertBefore(_link, indexStylesheetLink);
        } catch (e) {
            console.error(e);
        }
    }

    // head.removeChild(indexStylesheetLink);
    // head.appendChild(indexStylesheetLink);

    // 获取父页面的根元素
    var parentRoot = window.parent.document.documentElement;

    // 获取根元素的 data-theme-mode 属性值
    var themeMode = parentRoot.getAttribute("data-theme-mode");

    // 添加 data-theme-mode 属性并设置属性值为 "light"
    document.documentElement.setAttribute("data-theme-mode", themeMode);
}

function isValidLink(curlinkHref: string): boolean {
    // 官方主题样式默认引用
    if (
        curlinkHref.indexOf("/appearance/themes/daylight/theme.css",) >= 0
        || curlinkHref.indexOf("/appearance/themes/midnight/theme.css",) >= 0
        // || curlinkHref.indexOf("base.") >= 0
    ) {
        return true;
    }
    if (
        settingsService.widgetGlobalSettingDto.useThirdPartyThemeStyles
        && curlinkHref.indexOf("appearance/themes",) >= 0
    ) {
        return true;
    }

    return false;
}

function formatCssLink(curLinkHref: string): string {

    if (curLinkHref.indexOf("/base.") >= 0) {
        curLinkHref = curLinkHref.replace("/base.", "/stage/build/app/base.");
    }
    return curLinkHref;
}

function isLinkExists(curlinkHref): boolean {
    let existingLinks = document.getElementsByTagName("head")[0].getElementsByTagName("link");
    for (let j = 0; j < existingLinks.length; j++) {
        if (existingLinks[j].getAttribute("href") == curlinkHref) {
            return true;
        }
    }
    return false;
}