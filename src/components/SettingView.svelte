<script lang="ts">
    import {afterUpdate, createEventDispatcher} from "svelte";
    import WidgetSettings from "@/components/WidgetSettings.svelte";
    import GlobalSettings from "@/components/GlobalSettings.svelte";

    const dispatch = createEventDispatcher();
    let activeTab = 'widget';

    afterUpdate(() => dispatch('update'));

    function handleSave() {
        dispatch('save');
    }

    function switchTab(tab: string) {
        activeTab = tab;
    }
</script>

<div class="tabs">
    <button class:active={activeTab === 'widget'} on:click={() => switchTab('widget')}>Widget Settings</button>
    <button class:active={activeTab === 'global'} on:click={() => switchTab('global')}>Global Settings</button>
</div>

<div class="tab-content">
    {#if activeTab === 'widget'}
        <WidgetSettings on:save={handleSave} />
    {/if}
    {#if activeTab === 'global'}
        <GlobalSettings on:save={handleSave} />
    {/if}
</div>

<style lang="scss">
  .tabs {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .tabs button {
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    cursor: pointer;
    background: none;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .tabs button.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
  }

  .tab-content {
    display: flex;
    justify-content: center;
  }
</style>
