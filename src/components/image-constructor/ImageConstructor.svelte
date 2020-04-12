<script>
  import { crossfade, scale } from 'svelte/transition';

  import CategoryList from '../category-list/CategoryList.svelte';
  import ImageLoader from './ImageLoader.svelte';
  import { imagesStore } from './store.js';
  import { categoriesStore } from '../category-list/store.js';
  import { compressFile } from '../../utils/utils.js';

  const [send, receive] = crossfade({
		duration: 200,
		fallback: scale
  });

  let isCategoryListVisible = true;
  let selected = null;
  let word = '';
  let nickname = '';
  let social = '';

  $: isLoadDisabled = $imagesStore.some(r => r.dataUrl === '' && r.url === '')
    || word.length < 3 || word.length > 12 || nickname === '' || social === '';

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
          };
        }
        return image;
      });

      imagesStore.set([...newImages]);
      selected = null;
    });
  }

  const handleLoadClick = () => {
    const request = {
      currentCategory: $categoriesStore.categoryList[$categoriesStore.currentCategoryIndex],
      images: $imagesStore,
      word,
      nickname,
      social,
    };

    console.log(request);

    // TODO: Request to server

    // const formData = new FormData();

    // formData.append('imageData', fileData);
    
    // $.ajax({
		//   type: 'POST',
		//   url: '/your/upload/url',
		//   data: formData,
		//   contentType: false,
		//   processData: false,
		//   success: function (data) {
		//   	if (data.success) {
		//   		alert('Your file was successfully uploaded!');
		//   	} else {
		//   		alert('There was an error uploading your file!');
		//   	}
		//   },
		//   error: function (data) {
		//   	alert('There was an error uploading your file!');
		//   }
	  // });
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
    background-color: var(--main-bg-color);
	}

	.phone {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 30%;
		height: 85%;
		border: 2vmin solid var(--main-grey-color);
		border-bottom-width: 5vmin;
		padding: 3vmin;
		border-radius: 2vmin;
	}

  h1 {
    display: none;
  }

  .humburger {
    display: none;
    background-color: var(--main-button-bg-color);
    border-radius: 10px;
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
    text-align: center;
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
    }
  }
</style>

{#if isCategoryListVisible}
  <CategoryList on:categoryChosenEvent={handleCategoryChosen} />
{/if}

<div class="container">
	<div class="phone">
    <div>
      <h1>Конструктор задания</h1>
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
</div>