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
    background-color: var(--main-bg-color);
    border: 2px solid var(--main-grey-color);
  }

  .no-image {
    background-color: var(--main-no-image-bg-color);
    border: 1px solid var(--main-borders-color);
    border-radius: 10px;
    width: 50%;
    height: 65%;
    margin-top: 3vmin;
    display: flex;
    align-items: center;
    text-align: center;
  }

  img {
    border: 1px solid var(--main-borders-color);
    border-radius: 10px;
    width: 50%;
    height: 65%;
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

  @media screen and (max-width: 500px) {
    .container {
      border: none;
      justify-content: flex-start;
    }

    .no-image {
      width: 75%;
      height: 55%;
    }

    img {
      width: 75%;
      height: 55%;
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
    <div class="no-image">Нет картинки. Выберите один из вариантов добавления ниже и загрузите картинку</div>
  {:else}
    <img src={url} alt="Произошла ошибка при загрузке картинки" />
  {/if}
  <TabLoader
    on:addUrlEvent
    on:addDataUrlEvent
    on:previewImageEvent={handlePreviewImage}
  />
</div>