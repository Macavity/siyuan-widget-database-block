<script lang="ts">
    export let inputValue: Array<{ value: number | string, label: string }>;
    export let bindValue: string | number | boolean;
</script>

<select bind:value={bindValue} class="b3-select fn__flex-center">
    {#each inputValue as option}
        <option value={option.value}>{option.label}</option>
    {/each}
</select>
