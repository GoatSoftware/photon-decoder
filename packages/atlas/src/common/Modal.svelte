<style>
  .modal-container {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 200ms ease;
    pointer-events: none;
  }

  .modal-container.open {
    opacity: 1;
    pointer-events: all;
  }

  .modal {
    background-color: rgba(255, 255, 255, 0.2);
    z-index: 1001;
    padding: 25px;
    border-radius: 2px;
  }

</style>

<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  export let open = false;

  function close() {
    dispatch('close', {
      backdrop: true
    })
  }

  function doNotClose(e) {
    e.stopPropagation();
  }
</script>

<div class:open class="modal-container" on:click={close}>
  <div class="modal" on:click={doNotClose}>
    <slot></slot>
  </div>
</div>