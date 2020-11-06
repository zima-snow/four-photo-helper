import { writable } from 'svelte/store';

export const defaultAppStore = {
  user: null,
}

export const appStore = writable(defaultAppStore);

