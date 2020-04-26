<script>
  import { crossfade, scale } from 'svelte/transition';
  import wretch from 'wretch';

  import CategoryList from '../category-list/CategoryList.svelte';
  import ImageLoader from './ImageLoader.svelte';
  import Notification from '../notification/Notification.svelte';
  import Loader from '../loader/Loader.svelte';
  import { notificationStore } from '../notification/store.js';
  import { imagesStore, defaultImagesStore } from './store.js';
  import { categoriesStore } from '../category-list/store.js';
  import { compressFile } from '../../utils/utils.js';
  import { isValidURL } from '../../utils/validation.js';
  import { API_URL } from '../../consts/common.js';

  const [send, receive] = crossfade({
		duration: 200,
		fallback: scale
  });

  let isCategoryListVisible = true;
  let selected = null;
  let word = '';
  let nickname = '';
  let social = '';
  let isLoading = false;

  $: isLoadDisabled = $imagesStore.some(r => r.dataUrl === '' && r.url === '')
    || word.length < 3 || word.length > 12 || nickname.length > 100 || isLoading;

  const handleSelectImage = (id) => {
    selected = id;
  };

  const handleCloseImage = (id) => {
    selected = null;
  };

  const handleAddUrl = ({ detail }) => {
    const newImages = $imagesStore.map(image => {
      if (image.id === selected) {
        return {
          ...image,
          url: detail,
          extension : detail.substring(detail.lastIndexOf('.') + 1),
          dataUrl: '',
        };
      }
      return image;
    });

    imagesStore.set([...newImages]);
    selected = null;
  };

  const handleAddDataUrl = ({ detail: { dataUrl, fileType } }) => {
    compressFile(dataUrl, fileType, (newDataUrl) => {
      const newImages = $imagesStore.map(image => {
        if (image.id === selected) {
          return {
            ...image,
            dataUrl: newDataUrl,
            extension: fileType,
            url: '',
          };
        }
        return image;
      });

      imagesStore.set([...newImages]);
      selected = null;
    });
  }

  const handleLoadClick = async () => {
    try {
      isLoading = true;

      if (social.length !== 0 && !isValidURL(social)) {
        notificationStore.set({
          message: `Не валидный URL адрес социальной сети. Пожалуйста, введите другой адрес.
          Например: https://www.instagram.com/programrobot/`,
          type: 'error',
        });
        isLoading = false;

        return;
      }

      const request = {
        category: $categoriesStore.categoryList[$categoriesStore.currentCategoryIndex],
        images: $imagesStore,
        word,
        nickname,
        social,
      };

      // TODO: Create constant for API address
      const response = await wretch().url(`${API_URL}/candidates`)
        .post(request)
        .json();

      notificationStore.set({ message: response.message, type: 'success' });
      imagesStore.set(defaultImagesStore);
      word = '';
    } catch (e) {
      const error = JSON.parse(e.message);
      notificationStore.set({ message: error.message, type: 'error' });
    } finally {
      isLoading = false;
    }
  };

  const handleCategoryListOpen = () => {
    isCategoryListVisible = true;
  };

  const handleCategoryChosen = () => {
    isCategoryListVisible = false;
  };
</script>

<style>
  .container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.phone {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 30%;
		height: 85%;
		border: 2vmin solid var(--main-grey-color);
		border-bottom-width: 5vmin;
		padding: 4vmin;
		border-radius: 2vmin;
	}

  h1 {
    display: none;
  }

  .humburger {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    background-color: var(--main-button-bg-color);
    border-radius: 10px;
    cursor: pointer;
  }

	.grid-img {
		display: grid;
		flex: 1;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(2, 50%);
		grid-gap: 2vmin;
	}

  .no-image {
    background-color: var(--main-no-image-bg-color);
    border: 1px solid var(--main-borders-color);
    border-radius: 10px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    font-size: 1.25em;
  }

  img {
    border: 1px solid var(--main-borders-color);
    border-radius: 10px;
    width: 100%;
    height: 100%;
  }

  .grid-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 40%);
    grid-gap: 2vmin;
    margin-top: 5vmin;
  }

  .grid-info input {
    width: 100%;
    margin-top: 1%;
    outline: 0;
  }

  .grid-item-social {
    grid-column: 1 / -1;
  }

  .upload-button {
    background-color: var(--main-button-bg-color);
    border-radius: 10px;
  }

  @media screen and (max-width: 1024px) {
    .phone {
		  position: relative;
		  display: flex;
		  flex-direction: column;
		  width: 60%;
		  height: 100%;
		  padding: 0 3vmin;
      border: none;
	  }

    .humburger {
      left: -20px;
    }
  }

  @media screen and (max-width: 500px) {
    .phone {
		  position: relative;
		  display: flex;
		  flex-direction: column;
		  width: 100%;
		  height: 100%;
		  padding: 0 3vmin;
      border: none;
	  }

    h1 {
      display: block;
      text-align: center;
		  font-weight: 300;
		  text-transform: uppercase;
		  font-size: 5vmin;
		  margin: 0.5em 0 1em 0;
      float: right;
	  }

    .grid-img {
		  grid-template-rows: repeat(2, 45%);
	  }

    .grid-info {
      margin-top: 0;
    }

    .humburger {
      display: block;
      top: 5px;
      left: 0;
    }
  }
</style>

{#if isCategoryListVisible}
  <CategoryList on:categoryChosenEvent={handleCategoryChosen} />
{/if}

<div class="container">
	<div class="phone">
    <div>
      {#if $categoriesStore.categoryList[$categoriesStore.currentCategoryIndex]}
        <h1>{$categoriesStore.categoryList[$categoriesStore.currentCategoryIndex].name}</h1>
      {/if}
      <button class="humburger" on:click={handleCategoryListOpen}>&#9776;</button>
    </div>

		<div class="grid-img">
			{#each $imagesStore as image}
				<div class="square">
					{#if selected !== image.id}
            {#if image.dataUrl.length === 0 && image.url.length === 0}
              <div
                class="no-image"
                on:click="{() => handleSelectImage(image.id)}"
							  in:receive={{key:image.id}}
							  out:send={{key:image.id}}
              >Нажмите, чтобы загрузить картинку</div>
            {:else}
              <img
                src={image.dataUrl || image.url}
                alt={image.id}
                on:click="{() => handleSelectImage(image.id)}"
                in:receive={{key:image.id}}
							  out:send={{key:image.id}}
              />
            {/if}
					{/if}
				</div>
			{/each}
		</div>

    <div class="grid-info">
      <div class="grid-item-word">
        <label for="word">Слово (3 - 12 букв)</label>
        <input
          id="word"
          type="text"
          placeholder="Слово"
          bind:value={word}
        />
      </div>
      <div class="grid-item-nickname">
        <label for="nickname">Имя или ник</label>
        <input
          id="nickname"
          type="text"
          placeholder="Имя или ник"
          bind:value={nickname}
        />
      </div>
      <div class="grid-item-social">
        <label for="social">Ссылка на профиль любой социальной сети</label>
        <input
          id="social"
          type="text"
          placeholder="Ссылка на профиль любой социальной сети"
          bind:value={social}
        />
      </div>
    </div>

    <button
      type="button"
      class="upload-button"
      disabled={isLoadDisabled}
      on:click={handleLoadClick}
    >
      Загрузить задание
    </button>

    {#if selected}
      <ImageLoader
        {selected}
        on:addUrlEvent={handleAddUrl}
        on:addDataUrlEvent={handleAddDataUrl}
        on:click={handleCloseImage}
      />
    {/if}
  </div>
  <Notification />
  {#if isLoading}
    <Loader />
  {/if}
</div>