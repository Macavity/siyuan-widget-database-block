<script lang="ts">
    import DatabaseAttributes from "@/components/DatabaseAttributes.svelte";
    import BuiltInAttributes from "@/components/BuiltInAttributes.svelte";
    import CustomAttributeView from "@/components/CustomAttributeView.svelte";
    import SettingView from "./components/SettingView.svelte";
    import ProtyleBreadcrumb from "@/components/ProtyleBreadcrumb.svelte";
    import {afterUpdate, onMount, setContext} from "svelte";
    import {getAttributeViewKeys} from "@/api";
    import {TabType} from "@/types/tab-type";
    import {AttributeTable} from "@/types/attribute-table";
    import {settingsService} from "@/module/settings/settings-service";
    import {refreshCssLink, updateFrameHeight} from "@/utils/htmlUtil";
    import {processAttributeData} from "@/services/block-database";
    import {type I18N} from "@/types/i18n";
    import {isCollapsed} from "@/stores/widgetStore";

    export let i18n: I18N;

    let allTableDtoMap: Map<string, AttributeTable> = new Map();
    let selectTableDto: AttributeTable;
    let selectTabType: TabType;
    let selectAttributeTabId: string;
    let showBuiltInAttr = false;
    let showCustomAttr = false;

    onMount(() => {
        init();
    });

    setContext("i18n", i18n);

    afterUpdate(() => onUpdate);

    async function init() {

        allTableDtoMap = new Map();
        refreshCssLink();
        selectTabType = settingsService.widgetSettings.lastSelectTabType;
        selectAttributeTabId = settingsService.widgetSettings.lastSelectAvId;
        showBuiltInAttr = settingsService.widgetSettings.showBuiltInAttr;
        showCustomAttr = settingsService.widgetSettings.showCustomAttr;

        await refreshBlockAttributeData();
    }

    async function refreshBlockAttributeData() {
        let attributeViewKeys = await getAttributeViewKeys(settingsService.widgetSettings.targetBlockId);
        let tableDTOs = processAttributeData(attributeViewKeys);
        refreshAttributeTable(tableDTOs);
        initSelectTab();
    }

    function refreshAttributeTable(tableDtoMap: Map<string, AttributeTable>) {
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
        console.log("triggerRefresh");
        await init();
    }

    // async function toggleCollapseTab() {
    //     settingsService.toggleCollapsed();
    //     console.log("toggleCollapseTab post", settingsService.isCollapsed);
    //     await settingsService.saveWidgetSettings();
    //     console.log("toggleCollapseTab post update", settingsService.isCollapsed);
    //     onUpdate();
    // }

    function clickTab(tabType: TabType) {
        selectTabType = tabType;
        selectTableDto = null;

        if(tabType !== TabType.COLLAPSED_TAB){
            isCollapsed.set(false);
        }

        settingsService.widgetSettings.lastSelectTabType = tabType;
        settingsService.saveWidgetSettings();
    }

    function handleTabChange(event) {
        clickTab(event.detail.tabType);
    }

    function handleAttributeTabChange(event) {
        selectTabType = event.detail.tabType;
        selectAttributeTabId = event.detail.avId;
        isCollapsed.set(false);
        settingsService.widgetSettings.lastSelectAvId = selectAttributeTabId;
        settingsService.widgetSettings.lastSelectTabType = selectTabType;
        settingsService.saveWidgetSettings();

        refreshBlockAttributeData();
    }

    function onSave() {
        triggerRefresh();
    }
</script>

<ProtyleBreadcrumb
        {allTableDtoMap}
        on:refresh={triggerRefresh}
        on:selectAttributeTab={handleAttributeTabChange}
        on:tabChange={handleTabChange}
        {selectAttributeTabId}
        {selectTabType}
        {showBuiltInAttr}
        {showCustomAttr}
/>

<div id="main-content-container">
    {#if !$isCollapsed}
        {#if selectTabType === TabType.SETTINGS_TAB}
            <SettingView on:update={onUpdate} on:save={onSave}/>
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
</style>