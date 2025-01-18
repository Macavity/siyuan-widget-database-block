<script lang="ts">
    import {afterUpdate, createEventDispatcher, onMount} from "svelte";
    import {settingsService} from "@/module/settings/settings-service";
    import {getBlockAttrs} from "@/api";
    import {BuiltInAttributeRow} from "@/types/attribute-row";
    import {getWindowSiyuan} from "@/libs/widget-api";

    let attributeRowDtos: BuiltInAttributeRow[] = [];
    let rowFlexBasisPercent = "99%";
    const dispatch = createEventDispatcher();

    onMount(() => {
        init();
    });
    afterUpdate(() => dispatch('update'));

    async function init() {
        let targetBlockId = settingsService.widgetSettings.targetBlockId;
        let blockAttrMap = await getBlockAttrs(targetBlockId);

        let blockBuiltInAttrMapList = [
            {
                name: "bookmark",
                showName: getWindowSiyuan().languages.bookmark,
                content: blockAttrMap["bookmark"],
            },
            {
                name: "name",
                showName: getWindowSiyuan().languages.name,
                content: blockAttrMap["name"],
            },
            {
                name: "alias",
                showName: getWindowSiyuan().languages.alias,
                content: blockAttrMap["alias"],
            },
            {
                name: "memo",
                showName: getWindowSiyuan().languages.memo,
                content: blockAttrMap["memo"],
            },
        ];

        for (const index in blockBuiltInAttrMapList) {
            let attrMap = blockBuiltInAttrMapList[index];
            let showName = attrMap.showName;
            let content = attrMap.content ? attrMap.content : "";
            let htmlContent = `<input value="${content}" type="text" class="b3-text-field b3-text-field--text fn__flex-1" disabled>`;
            if (attrMap.name == "memo") {
                htmlContent = `<textarea rows="2" class="b3-text-field b3-text-field--text fn__flex-1" disabled>${content}</textarea>`;
            }
            let rowDto = new BuiltInAttributeRow(showName, htmlContent);

            attributeRowDtos.push(rowDto);
        }
    }
</script>

<div class="document-properties" style="display:flex;flex-wrap: wrap;">
    {#each attributeRowDtos as item}
        <div
                class="block__icons av__row"
                style="flex-basis:{rowFlexBasisPercent}"
        >
            <div class="block__logo">
                <span class="text-white-space-wrap">{@html item.name}</span>
            </div>
            <div class="fn__flex-1 fn__flex block__logo-content">
                {@html item.content}
            </div>
        </div>
    {/each}
</div>
