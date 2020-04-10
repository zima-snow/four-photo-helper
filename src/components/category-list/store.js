import { writable } from 'svelte/store';

export const categoriesStore = writable({
  categoryList: [
    {
      id: '1',
      name: 'Блоггинг',
      alias: 'blogging',
    },
    {
      id: '2',
      name: 'Музыка',
      alias: 'music',
    },
  ],
  currentCategoryIndex: 0,
});
