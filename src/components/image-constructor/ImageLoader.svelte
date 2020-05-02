<script>
  import { onMount } from 'svelte';
  import { crossfade, scale } from 'svelte/transition';

  import TabLoader from './TabLoader.svelte';
  import { imagesStore } from './store.js';

  const [send, receive] = crossfade({
		duration: 200,
		fallback: scale
  });

  let url = '';
  export let selected;

  onMount(() => {
    if (selected) {
      const currentImage = $imagesStore.filter(r => r.id === selected)[0];
      url = currentImage.dataUrl || currentImage.url;
    }
  })

  const handlePreviewImage = ({ detail }) => {
    url = detail;
  }

</script>

<style>
  .container {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
    border: 2px solid var(--main-grey-color);
    background: var(--main-bg-color); /* Old browsers */
    background: -moz-linear-gradient(45deg, #4c4c4c 0%, #595959 12%, #666666 25%, #474747 39%, #2c2c2c 50%, #000000 51%, #111111 60%, #2b2b2b 76%, #1c1c1c 91%, #131313 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(45deg, #4c4c4c 0%,#595959 12%,#666666 25%,#474747 39%,#2c2c2c 50%,#000000 51%,#111111 60%,#2b2b2b 76%,#1c1c1c 91%,#131313 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(45deg, #4c4c4c 0%,#595959 12%,#666666 25%,#474747 39%,#2c2c2c 50%,#000000 51%,#111111 60%,#2b2b2b 76%,#1c1c1c 91%,#131313 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    overflow-y: scroll;
  }

  .no-image {
    background-color: var(--main-no-image-bg-color);
    border: 1px solid var(--main-borders-color);
    border-radius: 10px;
    width: 70%;
    height: 300px;
    margin-top: 3vmin;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-evenly;
    text-align: center;
    padding: 5px;
    font-size: 1.1em;
    overflow-y: scroll;
  }

  .example {
    word-break: break-word;
  }

  img {
    border: 1px solid var(--main-borders-color);
    border-radius: 10px;
    width: 70%;
    height: 400px;
    margin-top: 3vmin;
  }

  h2 {
    float: left;
  }

  .close-button {
    position: absolute;
    right: 0px;
    background-color: var(--main-button-bg-color);
    border-radius: 3px;
  }

  .notice-text {
    color: var(--light-yellow);
  }

  @media screen and (max-width: 1024px) {
    .container {
      height: 99%;
    }
  }

  @media screen and (max-width: 500px) {
    .container {
      border: none;
      justify-content: flex-start;
      height: 100%;
    }

    .no-image {
      width: 75%;
      height: 350px;
    }

    img {
      width: 75%;
      height: 350px;
    }
  }
</style>

<div
  class="container"
  in:receive={{key:selected}}
	out:send={{key:selected}}
>
  <div>
    <h2>Загрузка изображения</h2>
    <button class="close-button" on:click>x</button>
  </div>
  {#if url === ''}
    <div class="no-image">
      Нет картинки. Выберите один из вариантов добавления ниже и загрузите картинку.
      
      <div class="example">
        При добавлении URL картинки, желательно, чтобы адрес заканчивался на
        <span class="notice-text">".jpg", ".jpeg", ".png" или ".gif"</span>.
        Например: <span class="notice-text">https://ercourse.com/images/channel_image.png</span>
      </div>

      <div>
        Если картинка не грузится по URL, сохраните её на устройство,
        затем загрузите через вкладку "Загрузка с устройства".
      </div>
    </div>
  {:else}
    <img src={url} alt="Произошла ошибка при загрузке картинки" />
  {/if}
  <TabLoader
    on:addUrlEvent
    on:addDataUrlEvent
    on:previewImageEvent={handlePreviewImage}
  />
</div>