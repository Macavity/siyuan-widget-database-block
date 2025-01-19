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

<style lang="scss">
  .spinner {
    position: relative;
  }

  .spinner::after {
    animation: viewer-spinner 1s linear infinite;
    border: 4px solid rgba(255, 255, 255, .1);
    border-left-color: rgba(255, 255, 255, .5);
    border-radius: 50%;
    content: '';
    display: inline-block;
    height: 20px;
    left: 50%;
    margin-left: -10px;
    margin-top: -10px;
    position: absolute;
    top: 50%;
    width: 20px;
    z-index: 1;
  }

  @keyframes viewer-spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>