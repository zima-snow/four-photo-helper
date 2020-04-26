<script>
  import ImageConstructor from './components/image-constructor/ImageConstructor.svelte';
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@500&display=swap');
	:global(body) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: white;
    font-family: 'Comfortaa', cursive;
    background: #4c4c4c; /* Old browsers */
    background: -moz-linear-gradient(-45deg,  #4c4c4c 0%, #595959 12%, #666666 25%, #474747 39%, #2c2c2c 50%, #000000 51%, #111111 60%, #2b2b2b 76%, #1c1c1c 91%, #131313 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(-45deg,  #4c4c4c 0%,#595959 12%,#666666 25%,#474747 39%,#2c2c2c 50%,#000000 51%,#111111 60%,#2b2b2b 76%,#1c1c1c 91%,#131313 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(135deg,  #4c4c4c 0%,#595959 12%,#666666 25%,#474747 39%,#2c2c2c 50%,#000000 51%,#111111 60%,#2b2b2b 76%,#1c1c1c 91%,#131313 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */


    --white-color: white;
    --black-color: black;
    --main-grey-color: #ccc;
    --main-bg-color: #4c4c4c;

    --main-borders-color: blanchedalmond;
    --main-no-image-bg-color: #73b0d6;
    --main-button-bg-color: #f5c701;

    --light-yellow: #ffff72;
  }
</style>

<ImageConstructor />