import { TAVCol } from "siyuan";
import { isNotBlankStr } from "@/utils/stringUtil";
import { IAVCellValue } from "@/types/siyuan.types";
import { AttributeTable } from "@/types/attribute-table";
import { AttributeRow } from "@/types/attribute-row";
import { settingsService } from "@/module/settings/settings-service";
import { getIconHtml } from "@/utils/icon";
import { genAVValueHTML } from "@/libs/siyuan/protyle/render/av/blockAttr";

export function processAttributeData(
  attributeViewKeys: AttributeView[],
): Map<string, AttributeTable> {
  let tableDtoMap: Map<string, AttributeTable> = new Map();
  if (!attributeViewKeys || attributeViewKeys.length <= 0) {
    return tableDtoMap;
  }

  for (const table of attributeViewKeys) {
    if (!table) {
      continue;
    }

    let attributeDtos: AttributeRow[] = [];
    let avId = table.avID;
    let blockIds = table.blockIDs;
    let avName = table.avName;

    for (const keyValue of table.keyValues) {
      if (!keyValue) {
        continue;
      }

      let content = genAVValueHTML(keyValue.values[0]);
      let attributeType = keyValue.values[0].type;

      if (contentFilterValid(keyValue.values[0])) {
        // console.log(
        //     `被过滤的属性 content : ${content}, attributeType : ${attributeType} `,
        // );
        continue;
      }

      let iconHtml = getIconHtml(keyValue.key.icon, keyValue.key.type);

      let atrDto = new AttributeRow(
        keyValue.key.id,
        keyValue.key.name,
        attributeType,
        content,
        iconHtml,
      );
      attributeDtos.push(atrDto);
    }
    let tableDto = new AttributeTable(avId, blockIds, avName, attributeDtos);

    tableDtoMap.set(avId, tableDto);
  }

  return tableDtoMap;
}

function contentFilterValid(cellValue: IAVCellValue): boolean {
  let type: TAVCol = cellValue.type;
  let filterEmpty = settingsService.widgetSettingDto.filterEmpty;
  if (!filterEmpty) {
    return false;
  }
  let content: string = null;
  switch (type) {
    case "block":
      content = cellValue.block.content;
      break;
    case "text":
      content = cellValue.text.content;
      break;
    case "number":
      if (cellValue.number.isNotEmpty) {
        content = "1";
      }
      break;
    case "mSelect":
    case "select":
      if (cellValue.mSelect && cellValue.mSelect.length > 0) {
        content = "1";
      }
      break;
    case "mAsset":
      if (cellValue.mAsset && cellValue.mAsset.length > 0) {
        content = "1";
      }
      break;
    case "date":
    case "created":
    case "updated":
      content = (cellValue[type].content || "").toString();
      break;
    case "url":
      content = cellValue.url.content;
      break;
    case "phone":
      content = cellValue.phone.content;
      break;
    case "checkbox":
      content = "1";
      break;
    case "template":
      content = cellValue.template.content;
      if (content) {
        content = content.replace("<no value>", "").trim();
      }
      break;
    case "email":
      content = cellValue.email.content;
      break;
    case "relation":
      if (
        cellValue.relation?.contents &&
        cellValue.relation?.contents.length > 0 &&
        cellValue.relation?.contents[0]
      ) {
        content = "1";
      }
      break;
    case "rollup":
      if (cellValue.rollup?.contents && cellValue.rollup?.contents.length > 0) {
        content = "1";
      }
      break;
    case "lineNumber":
      break;
    default:
      content = "1";
      break;
  }
  if (isNotBlankStr(content)) {
    return false;
  } else {
    return true;
  }
}
