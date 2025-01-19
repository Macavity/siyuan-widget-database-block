<script lang="ts">
    import {createEventDispatcher} from "svelte";

    export let label: string;
    export let isSaving: boolean = false;

    const dispatch = createEventDispatcher();

    function handleClick(event: MouseEvent) {
        dispatch("click", {event});
    }
</script>

<button
    class="b3-button b3-button--text"
    class:b3-button--loading={isSaving}
    disabled={isSaving}
    on:click={handleClick}>
    {label}
</button>
