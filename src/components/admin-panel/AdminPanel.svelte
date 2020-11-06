<script>
  import { onMount } from 'svelte';
  import { crossfade, scale } from 'svelte/transition';
  import { Link, navigate } from 'svelte-routing';
  import DOMPurify from 'dompurify';
  import wretch from 'wretch';

  import Login from './Login.svelte';
  import Notification from '../notification/Notification.svelte';
  import ImageLoader from '../image-constructor/ImageLoader.svelte';
  import Loader from '../loader/Loader.svelte';
  import { appStore } from '../../store.js';
  import { categoriesStore } from '../category-list/store.js';
  import { imagesStore, defaultImagesStore } from '../image-constructor/store.js';
  import { notificationStore } from '../notification/store.js';
  import { compressFile } from '../../utils/utils.js';
  import { API_URL } from '../../consts/common.js';

  const [send, receive] = crossfade({
		duration: 200,
		fallback: scale
  });

  const token = localStorage.getItem('token');
  let isAuthorized = token !== undefined;
  let candidates = [];
  let currentCategory = 'emotion';
  let skip = 0;
  const limit = 20;

  let currentCandidate = {};
  let word = '';
  let nickname = '';
  let social = '';
  let newCategory = {};
  let sameWord = '';

  let imageSelected = null;
  let isLoading = false;

  const loadCandidates = async () => {
    try {
      isLoading = true;
      candidates = await wretch()
        .url(`${API_URL}/candidates?category=${currentCategory}&limit=${limit}&skip=${skip}`)
        .headers({
          Authorization: token,
        })
        .get()
        .json();
    } catch (e) {
      notificationStore.set({
        message: e.message,
        type: 'error',
      });
      navigate('/login', { replace: true });
    } finally {
      isLoading = false;
    }
  }

  const updateImage = async (imageInfo, oldPath) => {
    try {
      isLoading = true;
      const request = {
        imageInfo,
        candidateId: currentCandidate._id,
        oldPath,
        alias: currentCategory,
        hash: currentCandidate.hash,
      }

      const response = await wretch()
        .url(`${API_URL}/candidates/images/update`)
        .headers({
          Authorization: token,
        })
        .post(request)
        .json();

      const images = response.data.images.map((image, index) => ({
        id: index + 1,
        alt: image,
        url: `https://for-alexander.tk/game-root/${currentCategory}/raw/${response.data.hash}/${image}`,
        order: index + 1,
      }));

      imagesStore.set(images);
      loadCandidates();

      notificationStore.set({ message: response.message, type: 'success' });
    } catch (e) {
      notificationStore.set({
        message: e.message,
        type: 'error',
      });
    } finally {
      isLoading = false;
    }
  }

  onMount(async () => {
    loadCandidates();

    if ($categoriesStore.categoryList.length === 0) {
      const categoryList = await wretch().url(`${API_URL}/categories`)
        .get()
        .json();

        categoriesStore.update(prev => ({ ...prev, categoryList: categoryList.categories }));
      }
  });

  const handleSelectChange = async (e) => {
    currentCategory = e.target.value;
    skip = 0;
    loadCandidates();
  }

  const handleLoadPrevClick = async () => {
    skip -= limit;
    loadCandidates();
  }

  const handleLoadNextClick = async () => {
    skip += limit;
    loadCandidates();
  }

  const handleResetClick = async () => {
    sameWord = '';
    currentCandidate = {};
    loadCandidates();
  }

  const handleFindTheSameClick = async () => {
    try {
      candidates = await wretch().url(`${API_URL}/same-words/${sameWord}`)
        .headers({
          Authorization: token,
        })
        .get()
        .json();
    } catch (e) {
      notificationStore.set({
        message: e.message,
        type: 'error',
      });
    }
  }

  const handleCandidateClick = (c) => {
    currentCategory = c && c.category
      ? $categoriesStore.categoryList.find(category => category.id === c.category).alias
      : $categoriesStore.categoryList.find(category => category.id === c.categories[0]._id).alias;

    currentCandidate = c;
    word = c.word;
    nickname = c.authorNickname;
    social = c.authorLink;

    const images = c.images.map((image, index) => ({
      id: index + 1,
      alt: image,
      url: `https://for-alexander.tk/game-root/${currentCategory}/raw/${c.hash}/${image}`,
      order: index + 1,
    }));

    imagesStore.set(images);
  }

  const handleSelectImage = (id) => {
    imageSelected = id;
  };

  const handleCloseImage = (id) => {
    imageSelected = null;
  };

  const handleAddUrl = ({ detail }) => {
    let imageInfo;
    let oldPath;
    const newImages = $imagesStore.map(image => {
      if (image.id === imageSelected) {
        const extension = detail.match(/\.(jpeg|jpg|gif|png)$/) != null
          ? detail.substring(detail.lastIndexOf('.') + 1) : 'jpg';

        oldPath = image.alt;
        imageInfo = {
          ...image,
          url: detail,
          extension,
          dataUrl: '',
        };

        return imageInfo
      }

      return image;
    });

    imagesStore.set([...newImages]);
    imageSelected = null;
    updateImage(imageInfo, oldPath);
  };

  const handleAddDataUrl = ({ detail: { dataUrl, fileType } }) => {
    try {
      let imageInfo;
      let oldPath;
      compressFile(dataUrl, fileType, (newDataUrl) => {
        const newImages = $imagesStore.map(image => {
          if (image.id === imageSelected) {
            oldPath = image.alt;
            imageInfo = {
              ...image,
              dataUrl: newDataUrl,
              extension: fileType,
              url: '',
            };

            return imageInfo;
          }

          return image;
        });

        imagesStore.set([...newImages]);
        imageSelected = null;
        updateImage(imageInfo, oldPath);
      });
    } catch (e) {
      notificationStore.set({
        message: `Ошибка при сжатии изображения. Возможно, вы пытаетесь загрузить
        слишком большой файл. Пожалуйста, загрузите другое изображение, или воспользутесь
        первым способом - через добавление URL адреса изображения.`,
        type: 'error',
      });
    }
  }

  const handleChangeImageOrder = async ({ detail }) => {
    try {
      isLoading = true;
      const currentName = $imagesStore.filter(r => r.id === imageSelected)[0].alt;
      const request = {
        id: currentCandidate._id,
        alias: currentCategory,
        hash: currentCandidate.hash,
        newPath: `photo${detail}.${currentName.split('.').pop()}`,
        oldPath: currentName,
      };

      const response = await wretch().url(`${API_URL}/candidates/images/change-order`)
        .headers({
          Authorization: token,
        })
        .put(request)
        .json();

      const images = response.data.images.map((image, index) => ({
        id: index + 1,
        alt: image,
        url: `https://for-alexander.tk/game-root/${currentCategory}/raw/${response.data.hash}/${image}`,
        order: index + 1,
      }));

      imagesStore.set(images);

      imageSelected = null;
      loadCandidates();

      notificationStore.set({ message: response.message, type: 'success' });
    } catch (e) {
      notificationStore.set({
        message: e.message,
        type: 'error',
      });
    } finally {
      isLoading = false;
    }
  }

  const handleNewCategoryChange = (e) => {
    newCategory.id = e.target.value;
  }

  const handleUpdateClick = async () => {
    try {
      isLoading = true;
      const request = {
        word,
        nickname,
        social,
        category: newCategory,
        oldCategoryAlias: currentCategory,
      };

      const response = await wretch().url(`${API_URL}/candidates/${currentCandidate._id}`)
        .headers({
          Authorization: token,
        })
        .put(request)
        .json();

      if (newCategory.id) {
        handleResetClick();
      } else {
        const index = candidates.findIndex(c => c._id === currentCandidate._id);
        candidates[index] = response.data;
      }

      notificationStore.set({ message: response.message, type: 'success' });
    } catch (e) {
      notificationStore.set({
        message: e.message,
        type: 'error',
      });
    } finally {
      isLoading = false;
    }
  }

  const handleDeleteClick = async () => {
    try {
      let isDelete = confirm('Подтверждение удаления');

      if (isDelete) {
        isLoading = true;
        const response = await wretch().url(`${API_URL}/candidates/${currentCandidate._id}`)
          .headers({
            Authorization: token,
          })
          .delete()
          .json();

        candidates = candidates.filter(c => c._id !== currentCandidate._id);
        currentCandidate = {};

        notificationStore.set({ message: response.message, type: 'success' });
      }
    } catch (e) {
      notificationStore.set({
        message: e.message,
        type: 'error',
      });
    } finally {
      isLoading = false;
    }
  }

  const handleCreateLevelClick = async () => {
    try {
      let isOK = confirm('Подтверждение создания уровня');

      if (isOK) {
        isLoading = true;
        const response = await wretch().url(`${API_URL}/levels/`)
          .headers({
            Authorization: token,
          })
          .post({ candidateId: currentCandidate._id })
          .json();

        candidates = candidates.filter(c => c._id !== currentCandidate._id);
        currentCandidate = {};

        notificationStore.set({ message: response.message, type: 'success' });
      }
    } catch (e) {
      notificationStore.set({
        message: e.message,
        type: 'error',
      });
    } finally {
      isLoading = false;
    }
  }

  const handleAddAuthorToLevelClick = async () => {
    try {
      let isOK = confirm('Подтверждение добавления автора к существующему уровню');

      if (isOK) {
        isLoading = true;
        const response = await wretch().url(`${API_URL}/levels/authors/add`)
          .headers({
            Authorization: token,
          })
          .post({
            nickname: currentCandidate.authorNickname,
            social: currentCandidate.authorLink,
            word: sameWord || currentCandidate.word,
          })
          .json();

        notificationStore.set({ message: response.message, type: 'success' });
      }
    } catch (e) {
      notificationStore.set({
        message: e.message,
        type: 'error',
      });
    } finally {
      isLoading = false;
    }
  }
</script>

<style>
  select, input {
    width: 100%;
  }

  img {
    transition: all 0.5s;
  }

  img:hover {
    box-shadow: 5px 5px 10px 2px var(--black-color);
  }

  .container {
		width: 100%;
    background-color: var(--main-bg-color);
	}

  .grid {
    display: grid;
    grid-template-columns: 27% 23% 1fr;
  }

  .grid > div {
    padding: 2%;
  }

  .main-actions-block {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
  }
  
  .search-the-same {
    margin-top: 5%;
  }

  .category-same-words-container {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
  }

  .level-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .candidate-items-container:first-child {
    border-top: 1px solid var(--black-color);
  }

  .candidate-item {
    width: 96%;
    height: 20px;
    padding: 2%;
    border: 1px solid var(--black-color);
    border-top: none;
  }

  .candidate-item.selected {
    background-color: var(--main-no-image-bg-color);
  }

  .candidate-item:hover {
    cursor: pointer;
    background-color: var(--main-no-image-bg-color);
    color: var(--black-color);
  }

  .candidate-items-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 17px;
  }

  .next-button {
    background-color: var(--main-button-bg-color);
    border-radius: 10px;
    margin-top: 5px;
    cursor: pointer;
  }

  .create-level-button {
    background-color: var(--light-yellow);
    border-radius: 10px;
    margin-top: 20px;
    cursor: pointer;
  }

  .delete-button {
    background-color: var(--light-red);
    border-radius: 10px;
    margin-top: 5px;
    cursor: pointer;
  }

  .grid-img {
		display: grid;
		grid-template-columns: repeat(2, 200px);
		grid-template-rows: repeat(2, 250px);
		grid-gap: 2vmin;
    justify-content: center;
	}

  .grid-img img:hover {
    cursor: pointer;
  }

  .grid-info {
    display: grid;
    grid-template-columns: 350px 250px;
    grid-template-rows: repeat(3, 50px);
    grid-gap: 2vmin;
    margin-top: 5vmin;
    justify-content: center;
  }

  .grid-info input {
    width: 100%;
    margin-top: 1%;
    outline: 0;
  }

  .grid-info button {
    width: 100%;
    height: 35px;
  }

  .cover {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: var(--black-color);
    opacity: 50%;
  }

  .image-loader-container {
    position: fixed;
    width: 30%;
    height: 100%;
    left: 35%;
  }
</style>

<div class="container">
  {#if isAuthorized}
    <div class="grid">
      <div class="main-actions-block">
        <div class="category-same-words-container">
          <label for="categories">Выберите категорию</label>

          <select id="categories" on:change={handleSelectChange}>
            {#each $categoriesStore.categoryList as category, index}
              <option value={category.alias} selected={index === 0}>{category.name}</option>
            {/each}
          </select>
          <div class="search-the-same">
            <label for="search-same">Поиск повторений</label>
            <input
              id="search-same"
              type="text"
              placeholder="Поиск повторений"
              bind:value={sameWord}
            />
            <button
              type="button"
              class="next-button"
              on:click={handleFindTheSameClick}
            >
              Найти
            </button>
          </div>
        </div>
        <div class="level-buttons">
          <button
            type="button"
            class="create-level-button"
            disabled={!currentCandidate._id}
            on:click={handleCreateLevelClick}
          >
            Сделать уровнем
          </button>
          <button
            type="button"
            class="create-level-button"
            disabled={!currentCandidate._id}
            on:click={handleAddAuthorToLevelClick}
          >
            Добавить автора
          </button>
          <div class="notification-container">
            <Notification />
          </div>
        </div>
      </div>
      <div>
        <div class="candidate-items-container">
          {#each candidates as candidate}
            <div
              class="candidate-item"
              class:selected={currentCandidate._id === candidate._id}
              on:click={() => handleCandidateClick(candidate)}
            >
              {DOMPurify.sanitize(candidate.word)}
            </div>
          {/each}
        </div>
        <div class="candidate-items-buttons">
          <button
            type="button"
            class="next-button"
            disabled={skip === 0}
            on:click={handleLoadPrevClick}
          >
            Предыдущие
          </button>
          <button
            type="button"
            class="next-button"
            on:click={handleLoadNextClick}
          >
            Следующие
          </button>
          <button
            type="button"
            class="next-button"
            on:click={handleResetClick}
          >
            Сброс
          </button>
        </div>
      </div>
      <div>
        <div class="grid-img">
          {#if currentCandidate.images}
            {#each $imagesStore as image}
				      <img
                src={image.url}
                alt={image.alt}
                width="200px"
                height="250px"
                on:click="{() => handleSelectImage(image.id)}"
                in:receive={{key:image.id}}
				      	out:send={{key:image.id}}
              />
			      {/each}
          {/if}
		    </div>
        {#if currentCandidate.word}
          <div class="grid-info">
            <div class="grid-item-word">
              <label for="word">Слово (3-12 букв)</label>
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
              <label for="social">Ссылка на профиль любой соцсети</label>
              <input
                id="social"
                type="text"
                placeholder="Ссылка на профиль любой соцсети"
                bind:value={social}
              />
            </div>
            <div>
              <label for="new-categories">Выберите категорию</label>

              <select id="new-categories" on:change={handleNewCategoryChange}>
                {#each $categoriesStore.categoryList as category}
                  <option
                    value={category.id}
                    selected={category.alias === currentCategory}
                  >
                    {category.name}
                  </option>
                {/each}
              </select>
            </div>
            <button
              type="button"
              class="next-button"
              disabled={word.length < 3 || word.length > 12 || nickname.length > 100 || isLoading}
              on:click={handleUpdateClick}
            >
              Обновить
            </button>
            <button
              type="button"
              class="delete-button"
              on:click={handleDeleteClick}
            >
              Удалить
            </button>
          </div>
        {/if}
      </div>
      {#if imageSelected}
        <div class="cover" />
        <div class="image-loader-container">
           <ImageLoader
            selected={imageSelected}
            withOrderChange
            on:addUrlEvent={handleAddUrl}
            on:addDataUrlEvent={handleAddDataUrl}
            on:changeImageOrderEvent={handleChangeImageOrder}
            on:click={handleCloseImage}
          />
        </div>
      {/if}
    </div>
  {:else}
    <div>
      <div>Нужно залогиниться под админом</div>
      <Link to="/login">Login</Link>
    </div>
  {/if}
  {#if isLoading}
    <Loader />
  {/if}
</div>