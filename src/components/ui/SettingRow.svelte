<script lang="ts">
    import SelectField from "@/components/ui/SelectField.svelte";

    export let label: string;
    export let description: string;
    export let inputType: "checkbox" | "number" | "select" | "text";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export let inputValue: any = null;
    export let inputId: string;
    export let bindValue: string | number | boolean;
</script>

<label class="fn__flex b3-label">
    <div class="fn__flex-1">
        {label}
        <div class="b3-label__text">{description}</div>
    </div>
    <span class="fn__space"></span>
    {#if inputType === "checkbox" && typeof bindValue === "boolean"}
        <input class="b3-switch fn__flex-center" id={inputId} type="checkbox" bind:checked={bindValue} />
    {:else if inputType === "number"}
        <input class="b3-text-field fn__flex-center" id={inputId} type="number" bind:value={bindValue} />
    {:else if inputType === "text"}
        <input class="b3-text-field fn__flex-center" id={inputId} type="text" bind:value={bindValue} />
    {:else if inputType === "select"}
        <SelectField {inputValue} {bindValue}></SelectField>
    {/if}
</label>