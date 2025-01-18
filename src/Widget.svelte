<script lang="ts">
    import DatabaseAttributes from "@/components/DatabaseAttributes.svelte";
    import BuiltInAttributes from "@/components/BuiltInAttributes.svelte";
    import CustomAttributeView from "@/components/CustomAttributeView.svelte";
    import Button from "@/components/Button.svelte";
    import {afterUpdate, onMount, setContext} from "svelte";
    import SettingView from "./components/SettingView.svelte";
    import {getAttributeViewKeys} from "@/api";
    import {TabType} from "@/types/tab-type";
    import {AttributeTable} from "@/types/attribute-table";
    import {settingsService} from "@/module/settings/settings-service";
    import {refreshCssLink, updateFrameHeight} from "@/utils/htmlUtil";
    import {processAttributeData} from "@/services/block-database";
    import {openRefLink} from "@/utils/ref-util";
    import {type I18N} from "@/types/i18n";

    export let i18n: I18N;

    let allTableDtoMap: Map<string, AttributeTable> = new Map();
    let selectTableDto: AttributeTable;
    let selectTabType: TabType;
    let selectAttributeTabId: string;
    let avTabClickCount = 0;
    let showBuiltInAttr = false;
    let showCustomAttr = false;

    onMount(() => {
        init();
    });

    setContext("i18n", i18n);

    afterUpdate(() => onUpdate);

    async function init() {
        await settingsService.load();

        allTableDtoMap = new Map();
        refreshCssLink();
        selectTabType = settingsService.widgetSettings.lastSelectTabType;
        selectAttributeTabId =
            settingsService.widgetSettings.lastSelectAvId;
        showBuiltInAttr = settingsService.widgetSettings.showBuiltInAttr;
        showCustomAttr = settingsService.widgetSettings.showCustomAttr;

        await refreshBlockAttributeData();
    }

    async function refreshBlockAttributeData() {
        let targetBlockId = settingsService.widgetSettings.targetBlockId;
        let attributeViewKeys = await getAttributeViewKeys(targetBlockId);

        let tableDtos = processAttributeData(attributeViewKeys);
        refreshAttributeTable(tableDtos);
        initSelectTab();
    }

    function refreshAttributeTable(
        tableDtoMap: Map<string, AttributeTable>,
    ) {
        if (tableDtoMap && tableDtoMap.size > 0) {
            allTableDtoMap = tableDtoMap;
            selectTableDto = allTableDtoMap.get(selectAttributeTabId);
            if (!selectTableDto) {
                selectTableDto = allTableDtoMap.values().next().value;
            }
            selectAttributeTabId = selectTableDto.avId;
        }
    }

    function initSelectTab() {
        if (!selectTabType) {
            if (selectTableDto) {
                selectTabType = TabType.DATABASE_ATTR_TAB;
            } else if (showBuiltInAttr) {
                selectTabType = TabType.BUILT_IN_ATTR_TAB;
            } else if (showCustomAttr) {
                selectTabType = TabType.CUSTOM_ATTR_TAB;
            } else {
                selectTabType = TabType.SETTINGS_TAB;
            }
        }
        if (selectTabType == TabType.DATABASE_ATTR_TAB && !selectTableDto) {
            selectTabType = null;
            initSelectTab();
        }
        if (selectTabType == TabType.BUILT_IN_ATTR_TAB && !showBuiltInAttr) {
            selectTabType = null;
            initSelectTab();
        }
        if (selectTabType == TabType.CUSTOM_ATTR_TAB && !showCustomAttr) {
            selectTabType = null;
            initSelectTab();
        }
    }

    function onUpdate() {
        updateFrameHeight();
        setTimeout(() => {
            updateFrameHeight();
        }, 120);
    }

    async function triggerRefresh() {
        init();
    }

    async function toggleCollapseTab() {
        settingsService.widgetCollapsed = !settingsService.widgetCollapsed;
        onUpdate();
    }

    function clickTab(tabType: TabType) {
        selectTabType = tabType;
        selectTableDto = null;

        settingsService.widgetSettings.lastSelectTabType = tabType;
        settingsService.update(settingsService.widgetSettings);
    }

    function clickAttributeTab(
        event: MouseEvent | KeyboardEvent,
        tabType: TabType,
        avId: string,
    ) {
        if (tabType != TabType.DATABASE_ATTR_TAB) {
            return;
        }
        avTabClickCount++;

        if (avTabClickCount === 1) {
            selectTabType = tabType;
            selectAttributeTabId = avId;
            settingsService.widgetSettings.lastSelectAvId = avId;
            settingsService.widgetSettings.lastSelectTabType = tabType;
            settingsService.update(settingsService.widgetSettings);
            refreshBlockAttributeData();
            setTimeout(() => {
                avTabClickCount = 0; // reset count
            }, 120);
        }
        if (
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            avTabClickCount === 2
        ) {
            let dto: AttributeTable = allTableDtoMap.get(avId);
            let blockId = dto.blockIds[0];
            // Open the node where the database exists
            openRefLink(event, blockId);
            avTabClickCount = 0;
        }
    }
</script>

<div class="fn__flex">
    <div class="fn__flex layout-tab-bar" id="top-navigation-bar">
        <div class="fn__flex-grow">

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

        <div class="fn__flex-right">
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

    </div>
</div>
<div id="main-content-container">
    {#if !settingsService.widgetCollapsed}
        {#if selectTabType === TabType.SETTINGS_TAB}
            <SettingView on:update={onUpdate}/>
        {/if}
        {#if selectTabType === TabType.BUILT_IN_ATTR_TAB}
            <BuiltInAttributes on:update={onUpdate}/>
        {/if}
        {#if selectTabType === TabType.CUSTOM_ATTR_TAB}
            <CustomAttributeView on:update={onUpdate}/>
        {/if}

        {#if (selectTabType === TabType.DATABASE_ATTR_TAB) && selectTableDto}
            <DatabaseAttributes tableDto={selectTableDto} on:update={onUpdate}/>
        {/if}
    {/if}
</div>

<style lang="scss">
  .vertical-separator {
    border-left: 1px solid #ccc;
    height: 30px;
    margin: 6px;
  }

  .layout-tab-bar {
    width: 100%;
  }

  .fn__flex-grow {
    flex-grow: 1;
  }

  .fn__flex-right {
    display: flex;
    align-items: center;
  }
</style>
