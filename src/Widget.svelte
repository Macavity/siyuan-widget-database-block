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
    import ProtyleBreadcrumb from "@/components/ProtyleBreadcrumb.svelte";

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
        let attributeViewKeys = await getAttributeViewKeys(settingsService.widgetSettings.targetBlockId);

        let tableDTOs = processAttributeData(attributeViewKeys);
        refreshAttributeTable(tableDTOs);
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
        console.log("triggerRefresh");
        await init();
    }

    async function toggleCollapseTab() {
        settingsService.widgetCollapsed = !settingsService.widgetCollapsed;
        onUpdate();
    }

    function clickTab(tabType: TabType) {
        selectTabType = tabType;
        selectTableDto = null;

        settingsService.widgetSettings.lastSelectTabType = tabType;
        settingsService.updateWidgetSettings(settingsService.widgetSettings);
    }


    function onSave() {
        triggerRefresh();
    }
</script>

<ProtyleBreadcrumb
        {allTableDtoMap}
        {i18n}
        on:collapseToggle={toggleCollapseTab}
        on:refresh={triggerRefresh}
        on:tabChange={(e) => clickTab(e.detail.tabType)}
        {selectAttributeTabId}
        {selectTabType}
        {showBuiltInAttr}
        {showCustomAttr}
/>
<div id="main-content-container">
    {#if !settingsService.widgetCollapsed}
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
