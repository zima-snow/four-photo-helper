<script>
  import { createEventDispatcher } from 'svelte';

  import { isUploadSupported, isSizeOfBase64LessMax } from '../../utils/utils.js';
  import { testImage } from '../../utils/validation.js';
  import { notificationStore } from '../notification/store.js';

  export let withOrderChange = false;

  const dispatch = createEventDispatcher();

  let active = '1';
  let url = '';
  let dataUrl = '';
  let fileType;
  let order;

  const switchActive = (index) => {
    active = index;
  };

  const handleUrlChange = (e) => {
    url = e.target.value;
    dispatch('previewImageEvent', url);
  };

  const handleFileInputChange = (e) => {
    const tgt = e.target || window.event.srcElement;
    const files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
      const fr = new FileReader();
      fileType = files[0].type;

      fr.onload = () => {
        dataUrl = fr.result;
        dispatch('previewImageEvent', dataUrl);
      };

      fr.onerror = () => {
        notificationStore.set({
          message: 'Ошибка чтения. Пожалуйста, загрузите другое изображение.',
          type: 'error',
        });
	    };

      fr.readAsDataURL(files[0]);
    }

    // Not supported
    else {
      notificationStore.set({
        message: `Обработка изображений не поддерживается Вашим браузером.
          Пожалуйста, загрузите изображение через копирование ссылки на него в соседней вкладке.`,
        type: 'warning',
      });
    }
  };

  const handleAddUrlConfirm = () => {
    testImage(url).then(() => {
      dispatch('addUrlEvent', url);
    }, () => {
      url = '';
      dispatch('previewImageEvent', url);
      notificationStore.set({
        message: `Не валидный URL адрес изображения. Пожалуйста, введите другой адрес.
        Рекомендуется вводить URL, заканчивающийся на ".jpg", ".jpeg", ".png" или ".gif".
        Например: https://ercourse.com/images/channel_image.png`,
        type: 'error',
      });
    });
  }

  const handleAddDataUrlConfirm = () => {
    if (isSizeOfBase64LessMax(dataUrl)) {
      dispatch('addDataUrlEvent', { dataUrl, fileType });
    } else {
      notificationStore.set({
        message: `Размер загружаемого изображения больше 5 Мегабайт.
          Пожалуйста, выберите изображение размером менее 5 Мегабайт.`,
        type: 'error',
      });
    }
  }

  const handleChangeOrderConfirm = () => {
    dispatch('changeImageOrderEvent', order);
  }
</script>

<style>
  .tab-container {
    width: 100%;
    margin-top: 20px;
  }

  .tab-buttons-container {
    display: flex;
  }

  .tab-button {
    border: none;
    flex: 1;
  }

  .tab-button.active {
    background-color: var(--main-no-image-bg-color);
    color: var(--white-color);
  }

  .tab-content {
    width: 100%;
    display: none;
  }

  .tab-content.active {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .tab-content > input {
    margin-top: 2%;
    width: 90%;
  }

  .tab-content > button {
    margin-top: 2%;
    width: 50%;
    background-color: var(--main-button-bg-color);
    border-radius: 10px;
  }

  label {
    text-align: center;
    width: 75%;
  }
</style>

<div class="tab-container">
  <div class="tab-buttons-container">
    <button
      class="tab-button"
      class:active={active === '1'}
      on:click={() => switchActive('1')}
    >
      Загрузка с устройства
    </button>
    <button
      class="tab-button"
      class:active={active === '2'}
      on:click={() => switchActive('2')}
    >
      Загрузка по ссылке
    </button>
    {#if withOrderChange}
      <button
        class="tab-button"
        class:active={active === '3'}
        on:click={() => switchActive('3')}
      >
        Изменить порядок
      </button>
    {/if}
  </div>
  <div class="tab-content" class:active={active === '1'}>
    {#if isUploadSupported()}
      <label for="file">Выберите изображение (размер не более 5 Мегабайт)</label>
      <input id="file" type="file" accept="image/*" on:change={handleFileInputChange}>
      <button
        type="button"
        disabled={!fileType}
        on:click={handleAddDataUrlConfirm}
      >
        Подтвердить
      </button>
    {:else}
      Браузер на Вашем устройстве не поддерживает загрузку файлов.
      Пожалуйста, загрузите изображение через копирование ссылки на него в соседней вкладке.
    {/if}
  </div>
  <div class="tab-content" class:active={active === '2'}>
    <label for="url">Введите ссылку</label>
    <input
      id="url"
      type="text"
      on:input={handleUrlChange}
      placeholder="Введите ссылку"
      bind:value={url}
    />
    <button
      type="button"
      disabled={url === ''}
      on:click={handleAddUrlConfirm}
    >
      Подтвердить
    </button>
  </div>
    <div class="tab-content" class:active={active === '3'}>
    <label for="order">Введите новый порядок</label>
    <input
      id="order"
      type="text"
      placeholder="Введите новый порядок"
      bind:value={order}
    />
    <button
      type="button"
      disabled={order === '' || ![1, 2, 3, 4].includes(+order)}
      on:click={handleChangeOrderConfirm}
    >
      Изменить
    </button>
  </div>
</div>