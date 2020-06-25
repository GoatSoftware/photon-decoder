<style>
  .button {
    align-items: center;
    background-color: white;
    border-radius: 2px;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    box-sizing: border-box;
    display: flex;
    height: 100%;
    justify-content: center;
    padding: 20px;
    transition: box-shadow 350ms ease;
    width: 100%;
    font-size: 2.5rem;
  }
  .button:hover {
    box-shadow: 10px 10px 20px 0 rgba(0, 0, 0, 0.2);
  }
</style>

<div class="button"><slot/></div>

