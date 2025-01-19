<script lang="ts">
    import {afterUpdate, createEventDispatcher, getContext} from "svelte";
    import WidgetSettings from "@/components/WidgetSettings.svelte";
    import GlobalSettings from "@/components/GlobalSettings.svelte";
    import {Context} from "@/types/context";

    const dispatch = createEventDispatcher();
    let activeTab = 'widget';
    const i18n = getContext(Context.I18N)

    afterUpdate(() => dispatch('update'));

    function handleSave() {
        dispatch('save');
    }

    function switchTab(tab: string) {
        activeTab = tab;
    }
</script>

<div class="layout-tab-bar fn__flex">
    <div class="item item--full"
         class:item--focus={activeTab === 'widget'}
         on:click={() => switchTab('widget')}
         on:keydown={() => switchTab('widget')}
         role="button"
         tabindex="0"
    >
        <span class="fn__flex-1"></span>
        <span class="item__text">{i18n.currentWidgetSettings}</span>
        <span class="fn__flex-1"></span>
    </div>
    <div class="item item--full"
         class:item--focus={activeTab === 'global'}
         on:click={() => switchTab('global')}
         on:keydown={() => switchTab('global')}
         role="button"
         tabindex="0"
    >
        <span class="fn__flex-1"></span>
        <span class="item__text">{i18n.globalSettings}</span>
        <span class="fn__flex-1"></span>
    </div>
</div>

<div class="tab-content">
    {#if activeTab === 'widget'}
        <WidgetSettings on:save={handleSave}/>
    {/if}
    {#if activeTab === 'global'}
        <GlobalSettings on:save={handleSave}/>
    {/if}
</div>

<style lang="scss">
  .tab-content {
    display: flex;
    justify-content: center;
  }
</style>
