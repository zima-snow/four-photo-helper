<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import wretch from 'wretch';

  import Loader from '../loader/Loader.svelte';
  import { categoriesStore } from './store.js';
  import { notificationStore } from '../notification/store.js';
  import { API_URL } from '../../consts/common.js';

  const dispatch = createEventDispatcher();

  let isLoading = false;

  onMount(async () => {
    try { 
      if ($categoriesStore.categoryList.length === 0) {
        isLoading = true;
        const categoryList = await wretch().url(`${API_URL}/categories`)
        .get()
        .json();

        categoriesStore.update(prev => ({ ...prev, categoryList }));
        isLoading = false;
      }
    } catch (e) {
      const error = JSON.parse(e.message);
      notificationStore.set({ message: error.message, type: 'error' });
    }
  });

  const handleCategoryChange = (currentCategoryIndex) => {
    categoriesStore.update(prev => ({ ...prev, currentCategoryIndex }));
  };
</script>

<style>
  .container {
		display: flex;
    flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 50%;
		height: 100%;
    background: var(--main-bg-color); /* Old browsers */
    background: -moz-linear-gradient(-45deg,  #4c4c4c 0%, #595959 12%, #666666 25%, #474747 39%, #2c2c2c 50%, #000000 51%, #111111 60%, #2b2b2b 76%, #1c1c1c 91%, #131313 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(-45deg,  #4c4c4c 0%,#595959 12%,#666666 25%,#474747 39%,#2c2c2c 50%,#000000 51%,#111111 60%,#2b2b2b 76%,#1c1c1c 91%,#131313 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(135deg,  #4c4c4c 0%,#595959 12%,#666666 25%,#474747 39%,#2c2c2c 50%,#000000 51%,#111111 60%,#2b2b2b 76%,#1c1c1c 91%,#131313 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    position: fixed;
    top: 0;
    left: 25%;
    z-index: 1;
	}

  .category-button {
    width: 100%;
    border: none;
    height: 50px;
  }

  .category-button.selected {
    background-color: var(--main-no-image-bg-color);
  }

  .category-confirm {
    width: 50%;
    margin-top: 10%;
    background-color: var(--main-button-bg-color);
    border-radius: 10px;
  }

  @media screen and (max-width: 1024px) {
    .container {
      width: 80%;
      left: 10%;
    }
  }

  @media screen and (max-width: 500px) {
    .container {
      width: 100%;
      left: 0;
    }
  }
</style>

<div
  class="container"
  transition:slide="{{delay: 50, duration: 500, easing: quintOut }}"
>
  <h2>Выберите категорию</h2>
  {#each $categoriesStore.categoryList as category, index}
    <button
      type="button"
      id={category.alias}
      name={category.alias}
      class="category-button"
      class:selected={$categoriesStore.currentCategoryIndex === index}
      on:click={() => handleCategoryChange(index)}
    >{category.name}</button>
  {/each}
  <button
    type="button"
    class="category-confirm"
    on:click={() => dispatch('categoryChosenEvent')}
    disabled={$categoriesStore.categoryList.length === 0}
  >
    OK
  </button>
  {#if isLoading}
    <Loader />
  {/if}
</div>