import { isNotBlankStr } from "./stringUtil";

/**
 * 在点击<span data-type="block-ref">时打开思源块/文档
 * 为引入本项目，和原代码相比有更改
 * @refer https://github.com/leolee9086/cc-template/blob/6909dac169e720d3354d77685d6cc705b1ae95be/baselib/src/commonFunctionsForSiyuan.js#L118-L141
 * @license 木兰宽松许可证
 * @param {点击事件} event 
 */
export function openRefLink(event, paramId = "") {

    let 主界面 = window.parent.document
    let id;
    if (event && event.currentTarget && event.currentTarget.getAttribute("data-id")) {
        id = event.currentTarget.getAttribute("data-id");
    } else {
        id = paramId;
    }
    // 处理笔记本等无法跳转的情况
    if (!isNotBlankStr(id)) { return; }
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    let 虚拟链接 = 主界面.createElement("span")
    虚拟链接.setAttribute("data-type", "block-ref")
    虚拟链接.setAttribute("data-id", id)
    虚拟链接.style.display = "none";//不显示虚拟链接，防止视觉干扰
    let 临时目标 = 主界面.querySelector(".protyle-wysiwyg div[data-node-id] div[contenteditable]")
    临时目标.appendChild(虚拟链接);
    let clickEvent = new MouseEvent("click", {
        ctrlKey: event ? event.ctrlKey : undefined,
        shiftKey: event ? event.shiftKey : undefined,
        altKey: event ? event.altKey : undefined,
        bubbles: true
    });
    虚拟链接.dispatchEvent(clickEvent);
    虚拟链接.remove();
}


export function openImage(event, src = "") {

    let parentDocument = window.parent.document

    // 处理笔记本等无法跳转的情况
    if (!isNotBlankStr(src)) { return; }
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    let imgElement = parentDocument.createElement("img")
    imgElement.classList.add("av__cellassetimg");
    imgElement.setAttribute("src", src)
    imgElement.style.display = "none";//不显示虚拟链接，防止视觉干扰
    let tempParentElement = parentDocument.querySelector(".protyle-wysiwyg div[data-node-id] div[contenteditable]")
    tempParentElement.appendChild(imgElement);
    let clickEvent = new MouseEvent("click", {
        ctrlKey: event ? event.ctrlKey : undefined,
        shiftKey: true,
        altKey: event ? event.altKey : undefined,
        bubbles: true
    });
    imgElement.dispatchEvent(clickEvent);
    imgElement.remove();
}