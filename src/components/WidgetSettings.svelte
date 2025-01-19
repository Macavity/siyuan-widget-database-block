<script lang="ts">
    import { createEventDispatcher, getContext } from "svelte";
    import { settingsService } from "@/module/settings/settings-service";
    import { Context } from "@/types/context";
    import SubmitButton from "@/components/SubmitButton.svelte";
    import SettingRow from "@/components/ui/SettingRow.svelte";

    const dispatch = createEventDispatcher();
    let isSaving = false;
    const i18n = getContext(Context.I18N);

    let widgetSettingDto = {
        ...settingsService.widgetSettings,
    };

    const clickSaveButton = async function() {
        isSaving = true;
        await settingsService.updateWidgetSettings(widgetSettingDto);
        await settingsService.saveWidgetSettings();
        dispatch('save');
        isSaving = false;
    }
</script>

<div class="config__tab-container fn__flex-1">
    <h2 class="b3-label">
        {i18n.currentWidgetSettings}
    </h2>

    <SettingRow
            bindValue={widgetSettingDto.targetBlockId}
            description=""
            inputId="targetBlockId"
            inputType="text"
            label={i18n.targetBlock}
    />

    <SettingRow
            bindValue={widgetSettingDto.columns}
            description=""
            inputId="columns"
            inputType="number"
            label={i18n.columns}
    />

    <SettingRow
            bindValue={widgetSettingDto.filterEmpty}
            description=""
            inputId="filterEmpty"
            inputType="checkbox"
            label={i18n.hideNullProperties}
    />

    <SettingRow
            bindValue={widgetSettingDto.openDocAutoCollapsed}
            description=""
            inputId="openDocAutoCollapsed"
            inputType="checkbox"
            label={i18n.openDocCollapsed}
    />

    <SettingRow
            bindValue={widgetSettingDto.showBuiltInAttr}
            description=""
            inputId="showBuiltInAttr"
            inputType="checkbox"
            label={i18n.showBuiltInProperties}
    />

    <SettingRow
            bindValue={widgetSettingDto.showCustomAttr}
            description=""
            inputId="showCustomAttr"
            inputType="checkbox"
            label={i18n.showCustomProperties}
    />

    <div class="fn__flex-1 action-bar">
        <SubmitButton isSaving={isSaving}
                      label={i18n.save}
                      on:click={clickSaveButton} />
    </div>
</div>

<style>
    .action-bar {
        padding: 7px 24px;
        display: flex;
        flex-shrink: 0;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        box-sizing: border-box;
        user-select: none;
    }
</style>