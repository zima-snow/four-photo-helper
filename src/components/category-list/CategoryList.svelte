<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import wretch from 'wretch';

  import { categoriesStore } from './store.js';

  const dispatch = createEventDispatcher();

  onMount(async () => {
    const categoryList = await wretch().url('http://127.0.0.1:5000/api/categories')
      .get()
      .json();

    categoriesStore.update(prev => ({ ...prev, categoryList }));
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
		width: 100%;
		height: 100%;
    background-color: var(--main-bg-color);
    position: fixed;
    top: 0;
    left: 0;
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
  >
    OK
  </button>
</div>