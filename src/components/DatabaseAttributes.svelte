<script lang="ts">
    /* eslint-disable svelte/no-at-html-tags */
    import {afterUpdate, createEventDispatcher} from "svelte";
    import {openImage, openRefLink} from "@/utils/ref-util";
    import {AttributeTable} from "@/types/attribute-table";
    import {settingsService} from "@/module/settings/settings-service";

    export let tableDto: AttributeTable;
    let rowFlexBasisPercent = "99%";
    const dispatch = createEventDispatcher();

    afterUpdate(() => {
        onUpdate();
    });

    function onUpdate() {
        let columns = settingsService.widgetSettings.columns || 1;

        let rowFlexBasis = (100 / columns) - 2.1;
        rowFlexBasisPercent = rowFlexBasis + "%";

        dispatch('update');
    }

    function contentClick(event) {
        const clickElement = event.target;

        if (clickElement.tagName === "IMG" && clickElement.hasAttribute("src")) {
            const src = clickElement.getAttribute("src");
            openImage(event, src);
            return; // Return early if it's an image
        }

        if (
            clickElement.hasAttribute("data-type") &&
            clickElement.getAttribute("data-type") === "block-ref" &&
            clickElement.hasAttribute("data-id")
        ) {
            const blockId = clickElement.getAttribute("data-id");
            openRefLink(event, blockId);
        }
    }
</script>

<div class="fn__flex fn__flex-wrap">
    {#each tableDto.attributes as item (item.id)}
        <div
            class="block__icons av__row"
            style="flex-basis:{rowFlexBasisPercent}"
        >
            <div class="block__logo">
                {@html item.icon}
                <span class="text-white-space-wrap">{@html item.name}</span>
            </div>
            <div
                class="fn__flex-1 fn__flex block__logo-content"
                tabindex="0"
                role="button"
                on:click={contentClick}
                on:keydown={contentClick}
            >
                {@html item.content}
            </div>
        </div>
    {/each}
</div>
