<script lang="ts">
    import {afterUpdate, createEventDispatcher, getContext,} from "svelte";
    import {settingsService} from "@/module/settings/settings-service";
    import {Context} from "@/types/context";
    import SubmitButton from "@/components/SubmitButton.svelte";

    let globalSettingsFolded = true;
    const dispatch = createEventDispatcher();
    const i18n = getContext(Context.I18N);
    let isSaving = false;
    let isSavingGlobal = false;

    afterUpdate(() => dispatch('update'));

    let widgetSettingDto = {
        ...settingsService.widgetSettings,
    };
    let widgetGlobalSettings = {
        ...settingsService.globalSettings,
    };

    const clickSaveButton = async function() {
        isSaving = true;
        await settingsService.updateWidgetSettings(widgetSettingDto);
        dispatch('save');
        isSaving = false;
    }

    const clickSaveGlobalButton = async function() {
        isSavingGlobal = true;
        await settingsService.updateGlobalSettings(widgetGlobalSettings);
        dispatch('save');
        isSavingGlobal = false;
    }
</script>

<div class="flex_center flex-wrap">
    <div class="flex_center">
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

    <hr style="width: 100%;"/>
    <div class="flex_center">
        <h2
                class="fn__flex flex_center"
                style="flex-basis: 100%;"
        >
            {i18n.globalSettings}
            <button class="block__icon block__icon--show"
                    on:click={() => {
                        globalSettingsFolded = !globalSettingsFolded;
                    }}
                    on:keydown={() => {
                        globalSettingsFolded = !globalSettingsFolded;
                    }}>
                <svg class:b3-list-item__arrow--open={!globalSettingsFolded}>
                    <use xlink:href="#iconRight"></use>
                </svg>
            </button>
        </h2>
        {#if !globalSettingsFolded}
            <div class="fn__flex div_bottom">
                <div class="fn__flex-1">{i18n.targetMethod}：</div>
                <span class="fn__space"></span>
                <select
                        class="b3-select fn__flex-center fn__size200"
                        bind:value={widgetGlobalSettings.defaultGetTargetBlockMethod}
                >
                    <option value="RootBlock">{i18n.targetCurrentBlock}</option>
                    <option value="PreviousBlock">{i18n.targetPreviousBlock}</option>
                    <option value="NextBlock">{i18n.targetNextBlock}</option>
                </select>
            </div>
            <div class="fn__flex div_bottom">
                <div class="fn__flex-1">{i18n.defaultNumberOfColumns}：</div>
                <span class="fn__space"></span>
                <input
                        class="b3-text-field b3-text-field--text fn__flex-center"
                        type="number"
                        step="1"
                        min="1"
                        max="5"
                        id="apiTimeout"
                        bind:value={widgetGlobalSettings.defaultColumns}
                />
            </div>
            <div class="fn__flex div_bottom">
                <div class="fn__flex-1">{i18n.hideNullPropertiesByDefault}：</div>
                <span class="fn__space"></span>
                <input
                        class="b3-switch fn__flex-center"
                        type="checkbox"
                        bind:checked={widgetGlobalSettings.defaultFilterEmpty}
                />
            </div>
            <div class="fn__flex div_bottom">
                <div class="fn__flex-1">{i18n.collapseByDefault}：</div>
                <span class="fn__space"></span>
                <input
                        class="b3-switch fn__flex-center"
                        type="checkbox"
                        bind:checked={widgetGlobalSettings.defaultCollapsed}
                />
            </div>

            <div class="fn__flex div_bottom">
                <div class="fn__flex-1">{i18n.showBuiltInPropertiesByDefault}：</div>
                <span class="fn__space"></span>
                <input
                        class="b3-switch fn__flex-center"
                        type="checkbox"
                        bind:checked={widgetGlobalSettings.defaultShowBuiltInAttr}
                />
            </div>

            <div class="fn__flex div_bottom">
                <div class="fn__flex-1">{i18n.showCustomPropertiesByDefault}：</div>
                <span class="fn__space"></span>
                <input
                        class="b3-switch fn__flex-center"
                        type="checkbox"
                        bind:checked={widgetGlobalSettings.defaultShowCustomAttr}
                />
            </div>
            <div class="fn__flex div_bottom">
                <div class="fn__flex-1">{i18n.useThirdPartyThemeStyles}：</div>
                <span class="fn__space"></span>
                <input
                        class="b3-switch fn__flex-center"
                        type="checkbox"
                        bind:checked={widgetGlobalSettings.useThirdPartyThemeStyles}
                />
            </div>

            <div class="flex_center" style="flex-basis: 100%;">
                <SubmitButton label={i18n.saveGlobal}
                              isSaving={isSavingGlobal}
                              on:click={clickSaveGlobalButton} />
            </div>
        {/if}
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

    .flex_center {
        justify-content: center; /* 水平居中 */
        display: flex;
        flex-wrap: wrap;
    }

    .fn__flex-1 {
        width: 100px;
    }

    .b3-list-item__arrow--open {
        transform: rotate(90deg);
    }
</style>
