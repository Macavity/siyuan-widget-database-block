<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let label: string;
    export let isSaving: boolean = false;

    const dispatch = createEventDispatcher();

    function handleClick(event: MouseEvent) {
        dispatch("click", { event });
    }
</script>

<button class="b3-button" class:b3-button--loading={isSaving} disabled={isSaving} on:click={handleClick}>
    {label}
    {#if isSaving}
        <span class="spinner"></span>
    {/if}
</button>

<style lang="scss">
  .b3-button {
    margin: 0;
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
    box-sizing: border-box;
    padding: 6px 10px;
    border-radius: 20px;
    transition: var(--b3-transition);
    text-decoration: none;
  }

  .b3-button:hover {
    transform: scale(1.05);
  }

  .b3-button:active {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

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