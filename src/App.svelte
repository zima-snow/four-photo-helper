<script>
  import ImageConstructor from './components/image-constructor/ImageConstructor.svelte';
</script>

<style>
	:global(body) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    background-color: #444;
    color: white;

    --white-color: white;
    --black-color: black;
    --main-grey-color: #ccc;
    --main-bg-color: #444;

    --main-borders-color: blanchedalmond;
    --main-no-image-bg-color: #73b0d6;
    --main-button-bg-color: #f5c701;
  }
</style>

<ImageConstructor />