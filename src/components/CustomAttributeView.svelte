<script lang="ts">
    /* eslint-disable svelte/no-at-html-tags */
    import {afterUpdate, createEventDispatcher, onMount} from "svelte";
    import {getBlockAttrs} from "@/api";
    import {settingsService} from "@/module/settings/settings-service";
    import {BuiltInAttributeRow} from "@/types/attribute-row";

    let attributeRowDtos: BuiltInAttributeRow[] = [];
    let rowFlexBasisPercent = "99%";
    const dispatch = createEventDispatcher();

    onMount(() => {
        init();
    });
    afterUpdate(() => dispatch('update'));

    async function init() {
        await initBlockBuiltInAttr();
    }

    async function initBlockBuiltInAttr() {
        let targetBlockId = settingsService.widgetSettings.targetBlockId;
        let blockAttrMap = await getBlockAttrs(targetBlockId);

        for (const key in blockAttrMap) {
            if (!key.startsWith("custom-")) {
                continue;
            }
            let showName = key;
            let content = blockAttrMap[key];

            let htmlContent = `<textarea rows="2" class="b3-text-field b3-text-field--text fn__flex-1" disabled="">${content}</textarea>`;
            let rowDto = new BuiltInAttributeRow(showName, htmlContent);
            attributeRowDtos.push(rowDto);
        }
    }
</script>

<div class="flex-wrap">
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

<style lang="scss">

</style>