import { writable } from 'svelte/store';

export const imagesStore = writable([
  {
    id: '1',
    alt: 'First image',
    url: '',
    dataUrl: '',
    order: 1,
  },
  {
    id: '2',
    alt: 'Second image',
    url: '',
    dataUrl: '',
    order: 2,
  },
  {
    id: '3',
    alt: 'Third image',
    url: '',
    dataUrl: '',
    order: 3,
  },
  {
    id: '4',
    alt: 'Fourth image',
    url: '',
    dataUrl: '',
    order: 4,
  },
]);

