<script lang="ts">
    import {createEventDispatcher, getContext} from "svelte";
    import { settingsService } from "@/module/settings/settings-service";
    import {Context} from "@/types/context";
    import SubmitButton from "@/components/SubmitButton.svelte";

    const dispatch = createEventDispatcher();
    let isSaving = false;
    const i18n = getContext(Context.I18N);

    let widgetSettingDto = {
        ...settingsService.widgetSettings,
    };

    const clickSaveButton = async function() {
        isSaving = true;
        await settingsService.updateWidgetSettings(widgetSettingDto);
        dispatch('save');
        isSaving = false;
    }
</script>

<div class="flex_center flex-wrap">
    <h2 class="fn__flex flex_center" style="flex-basis: 100%;">
        {i18n.currentWidgetSettings}
    </h2>
    <div class="fn__flex div_bottom">
        <div class="fn__flex-1">{i18n.targetBlock}：</div>
        <span class="fn__space"></span>
        <input
                bind:value={widgetSettingDto.targetBlockId}
                class="b3-text-field b3-text-field--text fn__flex-center"
        />
    </div>

    <div class="fn__flex div_bottom">
        <div class="fn__flex-1">{i18n.columns}：</div>
        <span class="fn__space"></span>
        <input
                bind:value={widgetSettingDto.columns}
                class="b3-text-field b3-text-field--text fn__flex-center"
                id="apiTimeout"
                max="5"
                min="1"
                step="1"
                type="number"
        />
    </div>

    <div class="fn__flex div_bottom">
        <div class="fn__flex-1">{i18n.hideNullProperties}：</div>
        <span class="fn__space"></span>
        <input
                bind:checked={widgetSettingDto.filterEmpty}
                class="b3-switch fn__flex-center"
                type="checkbox"
        />
    </div>
    <div class="fn__flex div_bottom">
        <div class="fn__flex-1">{i18n.openDocCollapsed}：</div>
        <span class="fn__space"></span>
        <input
                bind:checked={widgetSettingDto.openDocAutoCollapsed}
                class="b3-switch fn__flex-center"
                type="checkbox"
        />
    </div>

    <div class="fn__flex div_bottom">
        <div class="fn__flex-1">{i18n.showBuiltInProperties}：</div>
        <span class="fn__space"></span>
        <input
                bind:checked={widgetSettingDto.showBuiltInAttr}
                class="b3-switch fn__flex-center"
                type="checkbox"
        />
    </div>

    <div class="fn__flex div_bottom">
        <div class="fn__flex-1">{i18n.showCustomProperties}：</div>
        <span class="fn__space"></span>
        <input
                bind:checked={widgetSettingDto.showCustomAttr}
                class="b3-switch fn__flex-center"
                type="checkbox"
        />
    </div>

    <div class="flex_center" style="flex-basis: 100%;">
        <SubmitButton isSaving={isSaving}
                      label={i18n.save}
                      on:click={clickSaveButton} />
    </div>
</div>

<style lang="scss">
  .fn__flex {
    display: flex;
    flex: 1 0 43%;
    border-image: linear-gradient(
                    to right,
                    transparent,
                    var(--b3-theme-on-background),
                    transparent
    ) 1;
    padding-bottom: 4px;
    margin: 10px;
    align-items: center;
  }

  .div_bottom {
    border-bottom: 1px solid var(--b3-theme-on-background);
    border-right: 2px solid var(--b3-theme-on-background);
  }

  .fn__flex-1 {
    width: 100px;
  }
</style>