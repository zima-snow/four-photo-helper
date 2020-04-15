import { writable } from 'svelte/store';

export const imagesStore = writable([
  {
    id: '1',
    alt: 'First image',
    url: '',
    dataUrl: '',
    order: 1,
    extension: '',
  },
  {
    id: '2',
    alt: 'Second image',
    url: '',
    dataUrl: '',
    order: 2,
    extension: '',
  },
  {
    id: '3',
    alt: 'Third image',
    url: '',
    dataUrl: '',
    order: 3,
    extension: '',
  },
  {
    id: '4',
    alt: 'Fourth image',
    url: '',
    dataUrl: '',
    order: 4,
    extension: '',
  },
]);

