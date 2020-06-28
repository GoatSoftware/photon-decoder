<style>
  :global(:root) {
    --basic: rgba(255, 255, 255, 0.2);
    --double: rgba(255, 255, 255, 0.4);
    --triple: rgba(255, 255, 255, 0.6);
  }

  :global(input),
  :global(select) {
    font-family: inherit;
    padding: 6px;
    border: none;
    background-color: var(--basic);
    color: inherit;
    outline: none;
    box-sizing: border-box;
    height: 30px;
    border: 1px solid transparent;
    transition: all 300ms ease;
  }

  :global(select option) {
    background: rgba(0, 0, 0, 0.7);
  }

  :global(input:read-only) {
    background-color: transparent;
  }

  :global(input.error) {
    border-color: rgba(255, 0, 0, 0.7);
    background: rgba(255, 0, 0, 0.2);
  }

  :global(::placeholder) {
    color: var(--basic);
  }

  :global(select option[hidden]) {
    color: var(--basic);
  }

  :global(button) {
    border: none;
    background-color: var(--basic);
    padding: 10px 20px;
    color: inherit;
    font-family: inherit;
    cursor: pointer;
    outline: none;
  }

  :global(button:hover) {
    background-color: var(--double);
  }

  :global(button:active) {
    background-color: var(--triple);
  }

  :global(::-webkit-scrollbar) {
    width: 12px;
  }

  :global(::-webkit-scrollbar-track) {
    background: var(--basic);
  }

  :global(::-webkit-scrollbar-thumb) {
    background: var(--basic);
  }

  :global(::-webkit-scrollbar-thumb:hover) {
    background: rgba(255, 255, 255, 0.4);
  }

  :global(.faded) {
    opacity: 0.3;
  }

  /* Toasts */
  :global(.toastify) {
    padding: 12px 20px;
    color: #fff;
    display: inline-block;
    box-shadow: 0 3px 6px -1px rgba(0, 0, 0, 0.12),
      0 10px 36px -4px rgba(255, 255, 255, 0.3);
    background: -webkit-linear-gradient(315deg, #73a5ff, #5477f5);
    background: linear-gradient(135deg, #73a5ff, #5477f5);
    position: absolute;
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
    border-radius: 2px;
    cursor: pointer;
    text-decoration: none;
    max-width: calc(50% - 20px);
    z-index: 2147483647;
  }
  :global(.toastify.on) {
    opacity: 1;
  }
  :global(.toast-close) {
    opacity: 0.4;
    padding: 0 5px;
  }
  :global(.toastify-right) {
    right: 15px;
  }
  :global(.toastify-left) {
    left: 15px;
  }
  :global(.toastify-top) {
    top: -150px;
  }
  :global(.toastify-bottom) {
    bottom: -150px;
  }
  :global(.toastify-rounded) {
    border-radius: 25px;
  }
  :global(.toastify-avatar) {
    width: 1.5em;
    height: 1.5em;
    margin: 0 5px;
    border-radius: 2px;
  }
  :global(.toastify-center) {
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    max-width: fit-content;
  }
</style>
