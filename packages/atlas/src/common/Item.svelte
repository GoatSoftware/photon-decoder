<style>
  .wrapper {
    position: relative;
    display: inline-block;
  }

  img {
    display: inline-block;
    width: 100%;
  }

  .tooltip {
    background: rgba(0, 0, 0, 0.75);
    position: absolute;
    padding: 10px;
    border-radius: 3px;
    visibility: hidden;
    top: 50%;
    z-index: 2;
    pointer-events: none;
    text-align: center;
    min-width: 100%;
  }

  img:hover + .tooltip {
    visibility: visible;
  }
</style>

<script>
  export let info = {};
  export let faded = false;

  let imageUrl = 'http://goatsoft.es/craftia/static/items';
</script>

{#if info.id}
  <span class="wrapper" class:faded>
    <img draggable="false" src={`${imageUrl}/${info.id}.png`} alt="">
    {#if info.name && !faded}
      <div class="tooltip">
        {info.name['ES-ES']}
      </div>
    {/if}
  </span>
{/if}
