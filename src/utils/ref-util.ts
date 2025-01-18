import { notEmpty } from "./stringUtil";

/**
 * Open SiYuan block/documentation when clicking on <span data-type=‘block-ref’>. * @refer https://github.com/leolee9086/cc-template/blob/6909dac169e720d3354d77685d6cc705b1ae95be/baselib/src/commonFunctionsForSiyuan.js#L118-L141
 * @license Magnolia
 */
export function openRefLink(event, paramId = "") {
  let document = window.parent.document;
  let id;
  if (
    event &&
    event.currentTarget &&
    event.currentTarget.getAttribute("data-id")
  ) {
    id = event.currentTarget.getAttribute("data-id");
  } else {
    id = paramId;
  }
  if (!notEmpty(id)) {
    return;
  }
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  let spanElement = document.createElement("span");
  spanElement.setAttribute("data-type", "block-ref");
  spanElement.setAttribute("data-id", id);
  spanElement.style.display = "none"; //不显示虚拟链接，防止视觉干扰
  let element = document.querySelector(
    ".protyle-wysiwyg div[data-node-id] div[contenteditable]",
  );
  element.appendChild(spanElement);
  let clickEvent = new MouseEvent("click", {
    ctrlKey: event ? event.ctrlKey : undefined,
    shiftKey: event ? event.shiftKey : undefined,
    altKey: event ? event.altKey : undefined,
    bubbles: true,
  });
  spanElement.dispatchEvent(clickEvent);
  spanElement.remove();
}

export function openImage(event, src = "") {
  let parentDocument = window.parent.document;

  if (!notEmpty(src)) {
    return;
  }
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  let imgElement = parentDocument.createElement("img");
  imgElement.classList.add("av__cellassetimg");
  imgElement.setAttribute("src", src);
  imgElement.style.display = "none"; //不显示虚拟链接，防止视觉干扰
  let tempParentElement = parentDocument.querySelector(
    ".protyle-wysiwyg div[data-node-id] div[contenteditable]",
  );
  tempParentElement.appendChild(imgElement);
  let clickEvent = new MouseEvent("click", {
    ctrlKey: event ? event.ctrlKey : undefined,
    shiftKey: true,
    altKey: event ? event.altKey : undefined,
    bubbles: true,
  });
  imgElement.dispatchEvent(clickEvent);
  imgElement.remove();
}
