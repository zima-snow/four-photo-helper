import { writable } from 'svelte/store';

export const categoriesStore = writable({
  categoryList: [],
  currentCategoryIndex: 0,
});
