<script lang="ts">
    import {createEventDispatcher, getContext} from "svelte";
    import {settingsService} from "@/module/settings/settings-service";
    import {Context} from "@/types/context";
    import SubmitButton from "@/components/SubmitButton.svelte";
    import SettingRow from "@/components/ui/SettingRow.svelte";

    const dispatch = createEventDispatcher();
    let isSavingGlobal = false;
    const i18n = getContext(Context.I18N);

    let widgetGlobalSettings = {
        ...settingsService.globalSettings,
    };

    const clickSaveGlobalButton = async function () {
        isSavingGlobal = true;
        await settingsService.updateGlobalSettings(widgetGlobalSettings);
        dispatch('save');
        isSavingGlobal = false;
    }
</script>

<div class="config__tab-container fn__flex-1">
    <h2 class="b3-label">
        {i18n.globalSettings}
    </h2>

    <SettingRow
            bindValue={widgetGlobalSettings.defaultGetTargetBlockMethod}
            description=""
            inputId="targetMethod"
            inputType="select"
            inputValue={[
            { value: "RootBlock", label: i18n.targetCurrentBlock },
            { value: "PreviousBlock", label: i18n.targetPreviousBlock },
            { value: "NextBlock", label: i18n.targetNextBlock }
        ]}
            label={i18n.targetMethod}
    />

    <SettingRow
            bindValue={widgetGlobalSettings.defaultColumns}
            description=""
            inputId="defaultColumns"
            inputType="number"
            label={i18n.defaultNumberOfColumns}
    />

    <SettingRow
            bindValue={widgetGlobalSettings.defaultFilterEmpty}
            description=""
            inputId="defaultFilterEmpty"
            inputType="checkbox"
            label={i18n.hideNullPropertiesByDefault}
    />

    <SettingRow
            bindValue={widgetGlobalSettings.defaultCollapsed}
            description=""
            inputId="defaultCollapsed"
            inputType="checkbox"
            label={i18n.collapseByDefault}
    />

    <SettingRow
            bindValue={widgetGlobalSettings.defaultShowBuiltInAttr}
            description=""
            inputId="defaultShowBuiltInAttr"
            inputType="checkbox"
            label={i18n.showBuiltInPropertiesByDefault}
    />

    <SettingRow
            bindValue={widgetGlobalSettings.defaultShowCustomAttr}
            description=""
            inputId="defaultShowCustomAttr"
            inputType="checkbox"
            label={i18n.showCustomPropertiesByDefault}
    />

    <SettingRow
            bindValue={widgetGlobalSettings.useThirdPartyThemeStyles}
            description=""
            inputId="useThirdPartyThemeStyles"
            inputType="checkbox"
            label={i18n.useThirdPartyThemeStyles}
    />

    <div class="fn__flex-1 action-bar">
        <SubmitButton isSaving={isSavingGlobal}
                      label={i18n.saveGlobal}
                      on:click={clickSaveGlobalButton}/>
    </div>
</div>

<style>
    .action-bar {
        padding: 7px 24px;
        flex-shrink: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        box-sizing: border-box;
        user-select: none;
    }
</style>