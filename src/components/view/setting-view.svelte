<script lang="ts">
    import { afterUpdate } from "svelte";
    import {settingsService} from "@/module/settings/settings-service";
    let globalSettingElementFold = true;

    let widgetSettingDto = {
        ...settingsService.widgetSettingDto,
    };
    let widgetGlobakSettingDto = {
        ...settingsService.widgetGlobalSettingDto,
    };

    function clickSaveButton() {
        settingsService.update(widgetSettingDto);
    }

    function clickSaveGlobalButton() {
        settingsService.updateLocalStorage(widgetGlobakSettingDto);
    }
    function handleKeyDownDefault() {}

    function setFrameHeight() {
        let contentHeight = document.getElementById("app").offsetHeight + 20;
        if (settingsService.widgetCollapsed) {
            contentHeight =
                document.getElementById("top-navigation-bar").offsetHeight + 20;
        }
        if (contentHeight <= 30) {
            return;
        }
        let frameElement = window.frameElement as HTMLElement;
        frameElement.style.height = contentHeight + "px";
        frameElement.style.width = "2048px";
    }
    $: {
        afterUpdate(afterRender);
    }

    function afterRender() {
        setFrameHeight();
        // setTimeout(() => {
        //     setFrameHeight();
        // }, 120);
    }
</script>

<div class="flex_center" style="display:flex;flex-wrap: wrap;">
    <div class="flex_center">
        <h2 class="fn__flex flex_center" style="flex-basis: 100%;">
            当前挂件设置
        </h2>
        <div class="fn__flex div_bottom">
            <div class="fn__flex-1">目标块：</div>
            <span class="fn__space"></span>
            <input
                class="b3-text-field b3-text-field--text fn__flex-center"
                bind:value={widgetSettingDto.targetBlockId}
            />
        </div>

        <div class="fn__flex div_bottom">
            <div class="fn__flex-1">列数：</div>
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
            <div class="fn__flex-1">过滤空值：</div>
            <span class="fn__space"></span>
            <input
                class="b3-switch fn__flex-center"
                type="checkbox"
                bind:checked={widgetSettingDto.filterEmpty}
            />
        </div>
        <div class="fn__flex div_bottom">
            <div class="fn__flex-1">自动折叠：</div>
            <span class="fn__space"></span>
            <input
                class="b3-switch fn__flex-center"
                type="checkbox"
                bind:checked={widgetSettingDto.openDocAutoCollapsed}
            />
        </div>

        <div class="fn__flex div_bottom">
            <div class="fn__flex-1">显示内置属性：</div>
            <span class="fn__space"></span>
            <input
                class="b3-switch fn__flex-center"
                type="checkbox"
                bind:checked={widgetSettingDto.showBuiltInAttr}
            />
        </div>

        <div class="fn__flex div_bottom">
            <div class="fn__flex-1">显示自定义属性：</div>
            <span class="fn__space"></span>
            <input
                class="b3-switch fn__flex-center"
                type="checkbox"
                bind:checked={widgetSettingDto.showCustomAttr}
            />
        </div>

        <div class="flex_center" style="flex-basis: 100%;">
            <button class="b3-button" on:click={clickSaveButton}>保存</button>
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
            全局设置
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
                <div class="fn__flex-1">读取块ID方式：</div>
                <span class="fn__space"></span>
                <select
                    class="b3-select fn__flex-center fn__size200"
                    bind:value={widgetGlobakSettingDto.defaultGetTargetBlockMethod}
                >
                    <option value="RootBlock">当前文档块</option>
                    <option value="PreviousBlock">挂件上方块</option>
                    <option value="NextBlock">挂件下方块</option>
                </select>
            </div>
            <div class="fn__flex div_bottom">
                <div class="fn__flex-1">默认列数：</div>
                <span class="fn__space"></span>
                <input
                    class="b3-text-field b3-text-field--text fn__flex-center"
                    type="number"
                    step="1"
                    min="1"
                    max="5"
                    id="apiTimeout"
                    bind:value={widgetGlobakSettingDto.defaultColumns}
                />
            </div>
            <div class="fn__flex div_bottom">
                <div class="fn__flex-1">默认过滤空值：</div>
                <span class="fn__space"></span>
                <input
                    class="b3-switch fn__flex-center"
                    type="checkbox"
                    bind:checked={widgetGlobakSettingDto.defaultFilterEmpty}
                />
            </div>
            <div class="fn__flex div_bottom">
                <div class="fn__flex-1">默认折叠：</div>
                <span class="fn__space"></span>
                <input
                    class="b3-switch fn__flex-center"
                    type="checkbox"
                    bind:checked={widgetGlobakSettingDto.defaultCollapsed}
                />
            </div>

            <div class="fn__flex div_bottom">
                <div class="fn__flex-1">默认显示内置属性：</div>
                <span class="fn__space"></span>
                <input
                    class="b3-switch fn__flex-center"
                    type="checkbox"
                    bind:checked={widgetGlobakSettingDto.defaultShowBuiltInAttr}
                />
            </div>

            <div class="fn__flex div_bottom">
                <div class="fn__flex-1">默认显示自定义属性：</div>
                <span class="fn__space"></span>
                <input
                    class="b3-switch fn__flex-center"
                    type="checkbox"
                    bind:checked={widgetGlobakSettingDto.defaultShowCustomAttr}
                />
            </div>
            <div class="fn__flex div_bottom">
                <div class="fn__flex-1">使用第三方主题样式：</div>
                <span class="fn__space"></span>
                <input
                    class="b3-switch fn__flex-center"
                    type="checkbox"
                    bind:checked={widgetGlobakSettingDto.useThirdPartyThemeStyles}
                />
            </div>

            <div class="flex_center" style="flex-basis: 100%;">
                <button class="b3-button" on:click={clickSaveGlobalButton}
                    >保存全局设置</button
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
