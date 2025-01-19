<script lang="ts">
    import {createEventDispatcher, getContext} from "svelte";
    import {settingsService} from "@/module/settings/settings-service";
    import {TabType} from "@/types/tab-type";
    import {openRefLink} from "@/utils/ref-util";
    import Button from "@/components/Button.svelte";
    import {AttributeTable} from "@/types/attribute-table";
    import {Context} from "@/types/context";
    import {isCollapsed} from "@/stores/widgetStore";
    import {updateFrameHeight} from "@/utils/htmlUtil";

    export let allTableDtoMap: Map<string, AttributeTable>;
    export let selectTabType: TabType;
    export let selectAttributeTabId: string;
    export let showBuiltInAttr: boolean;
    export let showCustomAttr: boolean;

    const i18n = getContext(Context.I18N);
    const dispatch = createEventDispatcher();
    let avTabClickCount = 0;

    function clickTab(tabType: TabType) {
        selectTabType = tabType;
        dispatch('tabChange', {tabType});
    }

    function clickAttributeTab(event: MouseEvent | KeyboardEvent, tabType: TabType, avId: string) {
        if (tabType != TabType.DATABASE_ATTR_TAB) {
            return;
        }
        avTabClickCount++;

        if (avTabClickCount === 1) {
            selectTabType = tabType;
            selectAttributeTabId = avId;
            setTimeout(() => {
                avTabClickCount = 0; // reset count
            }, 120);
            dispatch('selectAttributeTab', {tabType, avId});
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

    const toggleCollapseTab = async () => {
        isCollapsed.update(value => !value);
        await settingsService.saveWidgetSettings();
        updateFrameHeight();
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

    <Button icon={$isCollapsed ? "#iconExpand" : "#iconContract"}
            on:click={toggleCollapseTab}
            tooltip={$isCollapsed ? i18n.expand : i18n.collapse}/>

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