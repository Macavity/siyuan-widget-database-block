import { settingsService } from "@/module/settings/settings-service";

export function updateFrameHeight() {
  const widget = document.getElementById("widget");
  const topNavBar = document.getElementById("top-navigation-bar");
  const contentHeight = settingsService.widgetCollapsed
    ? topNavBar.offsetHeight + 20
    : widget.offsetHeight + 20;

  if (contentHeight <= 30) {
    return;
  }

  const frameElement = window.frameElement as HTMLElement;
  frameElement.style.height = `${contentHeight}px`;
  frameElement.style.width = "2048px";
}

export function refreshCssLink() {
  const head = document.getElementsByTagName("head")[0];

  const linkList = window.parent.document.getElementsByTagName("link"); //获取父窗口link标签对象列表
  const indexStylesheetLink = head.querySelector('link[href="index.css"]');

  for (let i = 0; i < linkList.length; i++) {
    const curLink = linkList[i];
    if (curLink.getAttribute("rel") != "stylesheet") {
      continue;
    }
    try {
      const curLinkHref = formatCssLink(curLink.href);
      if (!isValidLink(curLinkHref)) {
        continue;
      }

      // 检查是否已经存在相同href的<link>标签
      if (isLinkExists(curLink)) {
        continue;
      }

      const _link = document.createElement("link");
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

  const parentRoot = window.parent.document.documentElement;

  const themeMode = parentRoot.getAttribute("data-theme-mode");

  document.documentElement.setAttribute("data-theme-mode", themeMode);
}

function isValidLink(curlinkHref: string): boolean {
  if (
    curlinkHref.indexOf("/appearance/themes/daylight/theme.css") >= 0 ||
    curlinkHref.indexOf("/appearance/themes/midnight/theme.css") >= 0
    // || curlinkHref.indexOf("base.") >= 0
  ) {
    return true;
  }

  return (
    settingsService.globalSettings.useThirdPartyThemeStyles &&
    curlinkHref.indexOf("appearance/themes") >= 0
  );
}

function formatCssLink(curLinkHref: string): string {
  if (curLinkHref.indexOf("/base.") >= 0) {
    curLinkHref = curLinkHref.replace("/base.", "/stage/build/app/base.");
  }
  return curLinkHref;
}

function isLinkExists(curlinkHref): boolean {
  const existingLinks = document
    .getElementsByTagName("head")[0]
    .getElementsByTagName("link");
  for (let j = 0; j < existingLinks.length; j++) {
    if (existingLinks[j].getAttribute("href") == curlinkHref) {
      return true;
    }
  }
  return false;
}
