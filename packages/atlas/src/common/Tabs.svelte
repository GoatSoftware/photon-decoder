<style>
  .tabs {
    border: 1px solid var(--basic);
    height: 100%;
    box-sizing: border-box;
  }

  .tabs .select {
    display: flex;
    border-bottom: 1px solid var(--double);
    height: 70px;
    box-sizing: border-box;
  }

  .tabs .select .tab {
    padding: 25px;
    cursor: pointer;
  }

  .tabs .select .tab:hover {
    background-color: var(--basic);
  }

  .tabs .select .tab.selected {
    background-color: var(--basic);
  }

  .tabs .select .tab.selected:hover {
    background-color: var(--double);
  }

  .tabs-content {
    padding: 20px;
    height: calc(100% - 70px);
    box-sizing: border-box;
  }

  .tab-content {
    height: 100%;
  }
</style>

<script>
  let tabIndex = 1;
  export let info = [];

  function changeTab(index) {
    tabIndex = index;
  }
</script>



<div class="tabs">
  <div class="select">
    {#each info as tab, i}
      <div class="tab tab-{i} {tabIndex === i + 1 ? 'selected' : ''}" on:click={() => changeTab(i + 1)}>
        {tab}
      </div>
    {/each}
  </div>
  <div class="tabs-content">
    {#if 1 === tabIndex}
      <div class="tab-content tab-1">
        <slot name="1"></slot>
      </div>
    {/if}
    {#if 2 === tabIndex}
      <div class="tab-content tab-2">
        <slot name="2"></slot>
      </div>
    {/if}
    {#if 3 === tabIndex}
      <div class="tab-content tab-3">
        <slot name="3"></slot>
      </div>
    {/if}
    {#if 4 === tabIndex}
      <div class="tab-content tab-4">
        <slot name="4"></slot>
      </div>
    {/if}
    {#if 5 === tabIndex}
      <div class="tab-content tab-5">
        <slot name="5"></slot>
      </div>
    {/if}
  </div>
</div>
<slot></slot>