import { isNotBlankStr } from "@/utils/stringUtil";
import { getBlockByID } from "@/api";
import { isMobile } from "@/libs/siyuan/protyle/util/functions";

export function getWindowSiyuan() {
  if (typeof window.siyuan !== "undefined") {
    return window.siyuan;
  }
  return window.top.siyuan;
}

/**
 * @url https://github.com/OpaqueGlass/syplugin-hierarchyNavigate/blob/e05db2948d6feba5526148f0b78c5cc0ec33df07/src/syapi/index.ts#L352
 */
export function getCurrentWidgetId() {
  try {
    if (!window.frameElement.parentElement.parentElement.dataset.nodeId) {
      return window.frameElement.parentElement.parentElement.dataset.id;
    } else {
      return window.frameElement.parentElement.parentElement.dataset.nodeId;
    }
  } catch (err) {
    console.warn("getCurrentWidgetId window...nodeId方法失效");
    return null;
  }
}

export async function getDefaultTargetBlockId(
  method: "RootBlock" | "PreviousBlock" | "NextBlock",
) {
  let targetBlockId; //目标任务列表块id
  let thisWidgetBlockElem = window.frameElement.parentElement.parentElement;

  switch (method) {
    case "RootBlock":
      targetBlockId = await getCurrentDocId();
      break;
    case "PreviousBlock":
      if (thisWidgetBlockElem.previousElementSibling) {
        targetBlockId =
          thisWidgetBlockElem.previousElementSibling.getAttribute(
            "data-node-id",
          );
      }
      break;
    case "NextBlock":
      if (thisWidgetBlockElem.nextElementSibling) {
        targetBlockId =
          thisWidgetBlockElem.nextElementSibling.getAttribute("data-node-id");
      }
      break;
  }

  return targetBlockId;
}

/**
 * Copy https://github.com/OpaqueGlass/listChildDocs/blob/827fb46afc1dd0c529766c1d74cd9242152a902d/src/API.js#L300
 * Get current document id (pseudo-api)
 * Prefer to use jquery query
 */
export async function getCurrentDocId(): Promise<string> {
  let thisDocId: string;
  let thisWidgetId = getCurrentWidgetId();

  // Relying on widgetId sql lookup, the most stable solution at runtime (but the widget can't be queried when it's just inserted!)
  if (isNotBlankStr(thisWidgetId)) {
    try {
      let widgetBlockInfo = await getBlockByID(thisWidgetId);

      if (widgetBlockInfo && widgetBlockInfo.root_id) {
        thisDocId = widgetBlockInfo.root_id;
        return thisDocId;
      }
    } catch (error) {
      console.log("Failed to get document id by scheme A", error);
    }
  }

  try {
    if (isNotBlankStr(thisWidgetId)) {
      //通过获取挂件所在页面题头图的data-node-id获取文档id【安卓下跳转返回有问题，原因未知】
      let thisDocId = window.top.document
        .querySelector(
          `div.protyle-content:has(.iframe[data-node-id="${thisWidgetId}"]) .protyle-background`,
        )
        .getAttribute("data-node-id");
      if (isNotBlankStr(thisDocId)) {
        console.log("Failed to get document id by scheme B" + thisDocId);
        return thisDocId;
      }
    }
  } catch (err) {
    console.error(err);
  }

  // 移动端文档id获取
  if (isMobile()) {
    let temp;
    try {
      // 先前是因为移动端background id更新不及时，所以使用了文档icon获取的方法
      temp = window.top.document
        .querySelector(
          ".protyle-breadcrumb .protyle-breadcrumb__item .popover__block[data-id]",
        )
        ?.getAttribute("data-id");
      let iconArray = window.top.document.querySelectorAll(
        ".protyle-breadcrumb .protyle-breadcrumb__item .popover__block[data-id]",
      );
      for (let i = 0; i < iconArray.length; i++) {
        let iconOne = iconArray[i];
        if (
          iconOne.children.length > 0 &&
          iconOne.children[0].getAttribute("xlink:href") == "#iconFile"
        ) {
          temp = iconOne.getAttribute("data-id");
          break;
        }
      }
      console.log("文档图标获取当前文档id", temp);
      thisDocId = temp;
    } catch (e) {
      console.error("通过文档图标获取当前文档id失败", e);
      temp = null;
    }
    if (!thisDocId) {
      thisDocId = window.top.document
        .querySelector(".protyle.fn__flex-1:not(.fn__none) .protyle-background")
        ?.getAttribute("data-node-id");
      console.log("使用background的匹配值", thisDocId);
    }
    return thisDocId;
  }

  //widgetId不存在，则使用老方法（存在bug：获取当前展示的页面id（可能不是挂件所在的id））
  if (!isNotBlankStr(thisWidgetId)) {
    try {
      thisDocId = window.top.document
        .querySelector(
          ".layout__wnd--active .protyle.fn__flex-1:not(.fn__none) .protyle-background",
        )
        .getAttribute("data-node-id");
      console.log("获取当前文档idBy方案C" + thisDocId);
    } catch (err) {
      console.error("获取当前文档id均失败");
      return null;
    }
    return thisDocId;
  }
  return null;
}
