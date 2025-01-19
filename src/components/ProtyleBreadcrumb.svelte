<script lang="ts">
    import {createEventDispatcher, getContext} from "svelte";
    import { settingsService } from "@/module/settings/settings-service";
    import { TabType } from "@/types/tab-type";
    import { openRefLink } from "@/utils/ref-util";
    import { getAttributeViewKeys } from "@/api";
    import { processAttributeData } from "@/services/block-database";
    import Button from "@/components/Button.svelte";
    import {AttributeTable} from "@/types/attribute-table";
    import {Context} from "@/types/context";

    export let allTableDtoMap: Map<string, AttributeTable>;
    export let selectTabType: TabType;
    export let selectAttributeTabId: string;
    export let showBuiltInAttr: boolean;
    export let showCustomAttr: boolean;

    const i18n = getContext(Context.I18N);

    const dispatch = createEventDispatcher();
    let avTabClickCount = 0;

    async function refreshBlockAttributeData() {
        let attributeViewKeys = await getAttributeViewKeys(settingsService.widgetSettings.targetBlockId);
        let tableDTOs = processAttributeData(attributeViewKeys);
        refreshAttributeTable(tableDTOs);
    }

    function refreshAttributeTable(tableDtoMap: Map<string, AttributeTable>) {
        if (tableDtoMap && tableDtoMap.size > 0) {
            allTableDtoMap = tableDtoMap;
            selectAttributeTabId = allTableDtoMap.values().next().value.avId;
        }
    }

    function clickTab(tabType: TabType) {
        selectTabType = tabType;
        dispatch('tabChange', { tabType });
    }

    function clickAttributeTab(event: MouseEvent | KeyboardEvent, tabType: TabType, avId: string) {
        if (tabType != TabType.DATABASE_ATTR_TAB) {
            return;
        }
        avTabClickCount++;

        if (avTabClickCount === 1) {
            selectTabType = tabType;
            selectAttributeTabId = avId;
            settingsService.widgetSettings.lastSelectAvId = avId;
            settingsService.widgetSettings.lastSelectTabType = tabType;
            settingsService.updateWidgetSettings(settingsService.widgetSettings);
            refreshBlockAttributeData();
            setTimeout(() => {
                avTabClickCount = 0; // reset count
            }, 120);
        }
        if (event.ctrlKey || event.shiftKey || event.altKey || avTabClickCount === 2) {
            let dto: AttributeTable = allTableDtoMap.get(avId);
            let blockId = dto.blockIds[0];
            openRefLink(event, blockId);
            avTabClickCount = 0;
        }
    }

    function triggerRefresh() {
        dispatch('refresh');
    }

    function toggleCollapseTab() {
        settingsService.widgetCollapsed = !settingsService.widgetCollapsed;
        dispatch('collapseToggle');
    }
</script>

<div class="protyle-breadcrumb" id="top-navigation-bar">
    <div class="protyle-breadcrumb__bar protyle-breadcrumb__bar--nowrap">
        {#each Array.from(allTableDtoMap) as [key, item]}
            <Button
                    isFocused={selectTabType === TabType.DATABASE_ATTR_TAB && selectAttributeTabId === key}
                    on:click={(event) => clickAttributeTab(event.detail.event, TabType.DATABASE_ATTR_TAB, key)}
                    label={item.avName}
            />
        {/each}

        {#if showBuiltInAttr || showCustomAttr}
            <span class="vertical-separator"></span>
        {/if}

        {#if showBuiltInAttr}
            <Button isFocused={selectTabType === TabType.BUILT_IN_ATTR_TAB}
                    on:click={() => clickTab(TabType.BUILT_IN_ATTR_TAB)}
                    label={i18n.builtInProperties}/>
        {/if}

        {#if showCustomAttr}
            <Button isFocused={selectTabType === TabType.CUSTOM_ATTR_TAB}
                    on:click={() => clickTab(TabType.CUSTOM_ATTR_TAB)}
                    label={i18n.customProperties}/>
        {/if}
    </div>

    <span class="protyle-breadcrumb__space"></span>

    <Button icon="#iconRefresh"
            on:click={triggerRefresh}
            tooltip={i18n.refresh}/>

    <Button icon={settingsService.widgetCollapsed ? "#iconExpand" : "#iconContract"}
            on:click={toggleCollapseTab}
            tooltip={settingsService.widgetCollapsed ? i18n.expand : i18n.collapse}/>

    <Button icon="#iconSettings"
            isFocused={selectTabType === TabType.SETTINGS_TAB}
            on:click={() => clickTab(TabType.SETTINGS_TAB)}
            tooltip={i18n.setup}/>
</div>

<style lang="scss">
  .vertical-separator {
    border-left: 1px solid #ccc;
    height: 30px;
    margin: 6px;
  }
</style>