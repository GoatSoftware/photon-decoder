<script>
  import Button from './Button.svelte';
  
  export let map = '';
</script>

<style>
  .menu {
    --grid-gap: 10%;;
    display: grid;
    grid-template-columns: calc(50% - (var(--grid-gap) / 2)) calc(50% - (var(--grid-gap) / 2));
    grid-gap: var(--grid-gap);
    padding: var(--grid-gap);
    box-sizing: border-box;
    height: 100%;
  }
</style>

<div class="menu">
  <Button>{map}</Button>
  <Button>Grupo</Button>
  <Button>Ciudades</Button>
  <Button>Recursos</Button>
  <Button>Loc</Button>
  <Button>Zonas</Button>
</div>
