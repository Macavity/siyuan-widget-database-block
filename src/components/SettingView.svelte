<script lang="ts">
    import {afterUpdate, createEventDispatcher, getContext,} from "svelte";
    import {settingsService} from "@/module/settings/settings-service";
    import {Context} from "@/types/context";

    let globalSettingElementFold = true;
    const dispatch = createEventDispatcher();

    const i18n = getContext(Context.I18N);

    afterUpdate(() => dispatch('update'));

    let widgetSettingDto = {
        ...settingsService.widgetSettings,
    };
    let widgetGlobalSettings = {
        ...settingsService.globalSettings,
    };

    function clickSaveButton() {
        settingsService.update(widgetSettingDto);
    }

    function clickSaveGlobalButton() {
        settingsService.updateLocalStorage(widgetGlobalSettings);
    }
    function handleKeyDownDefault() {}

</script>

<div class="flex_center" style="display:flex;flex-wrap: wrap;">
    <div class="flex_center">
        <h2 class="fn__flex flex_center" style="flex-basis: 100%;">
            {i18n.currentWidgetSettings}
        </h2>
        <div class="fn__flex div_bottom">
            <div class="fn__flex-1">{i18n.targetBlock}：</div>
            <span class="fn__space"></span>
            <input
                class="b3-text-field b3-text-field--text fn__flex-center"
                bind:value={widgetSettingDto.targetBlockId}
            />
        </div>

        <div class="fn__flex div_bottom">
            <div class="fn__flex-1">{i18n.columns}：</div>
            <span class="fn__space"></span>
            <input
                class="b3-text-field b3-text-field--text fn__flex-center"
                type="number"
                step="1"
                min="1"
                max="5"
                id="apiTimeout"
                bind:value={widgetSettingDto.columns}
            />
        </div>

        <div class="fn__flex div_bottom">
            <div class="fn__flex-1">{i18n.hideNullProperties}：</div>
            <span class="fn__space"></span>
            <input
                class="b3-switch fn__flex-center"
                type="checkbox"
                bind:checked={widgetSettingDto.filterEmpty}
            />
        </div>
        <div class="fn__flex div_bottom">
            <div class="fn__flex-1">{i18n.openDocCollapsed}：</div>
            <span class="fn__space"></span>
            <input
                class="b3-switch fn__flex-center"
                type="checkbox"
                bind:checked={widgetSettingDto.openDocAutoCollapsed}
            />
        </div>

        <div class="fn__flex div_bottom">
            <div class="fn__flex-1">{i18n.showBuiltInProperties}：</div>
            <span class="fn__space"></span>
            <input
                class="b3-switch fn__flex-center"
                type="checkbox"
                bind:checked={widgetSettingDto.showBuiltInAttr}
            />
        </div>

        <div class="fn__flex div_bottom">
            <div class="fn__flex-1">{i18n.showCustomProperties}：</div>
            <span class="fn__space"></span>
            <input
                class="b3-switch fn__flex-center"
                type="checkbox"
                bind:checked={widgetSettingDto.showCustomAttr}
            />
        </div>

        <div class="flex_center" style="flex-basis: 100%;">
            <button class="b3-button" on:click={clickSaveButton}>{i18n.save}</button>
        </div>
    </div>

    <hr style="width: 100%;" />
    <div class="flex_center">
        <h2
            class="fn__flex flex_center"
            style="flex-basis: 100%;"
            on:keydown={handleKeyDownDefault}
            on:click={() => {
                globalSettingElementFold = !globalSettingElementFold;
            }}
        >
            {i18n.globalSettings}
            <span class="block__icon block__icon--show">
                <svg
                    id="globalSettingSvg"
                    class={globalSettingElementFold
                        ? ""
                        : "b3-list-item__arrow--open"}
                    ><use xlink:href="#iconRight"></use></svg
                >
            </span>
        </h2>
        {#if !globalSettingElementFold}
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
                <button class="b3-button" on:click={clickSaveGlobalButton}
                    >{i18n.saveGlobal}</button
                >
            </div>
        {/if}
    </div>
</div>

<style>
    .fn__flex {
        display: flex;
        flex: 1 0 43%;
        border-image: linear-gradient(
                to right,
                transparent,
                var(--b3-theme-on-background),
                transparent
            )
            1;
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
    .b3-button {
        margin: 0;
        font-size: 100%;
        vertical-align: middle;
        font-family: var(--b3-font-family);
        outline: none;
        cursor: pointer;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border: none;
        box-shadow: none;
        background-color: var(--b3-theme-primary);
        color: var(--b3-theme-on-primary);
        line-height: 16px;
        font-weight: 400;
        font-size: 0.8125rem;
        display: inline-flex;
        align-items: center;
        box-sizing: border-box;
        padding: 6px 10px;
        border-radius: 20px;
        transition: var(--b3-transition);
        text-decoration: none;
    }
    .b3-button:hover {
        /* 悬浮时稍微增大一圈 */
        transform: scale(1.05);
    }
    .b3-button:active {
        /* 点击时显示阴影 */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .b3-list-item__arrow--open {
        transform: rotate(90deg);
    }
</style>
