<script>
  import { createEventDispatcher } from 'svelte';

  import { categoriesStore } from './store.js';

  const dispatch = createEventDispatcher();

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
    background-color: var(--white-color);
    border: 2px solid var(--main-grey-color);
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
  }
</style>

<div class="container">
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