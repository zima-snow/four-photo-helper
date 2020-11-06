<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing'; 
  import wretch from 'wretch';

  import Loader from '../loader/Loader.svelte';
  import Notification from '../notification/Notification.svelte';
  import { notificationStore } from '../notification/store.js';
  import { appStore } from '../../store.js';
  import { API_URL } from '../../consts/common.js';

  let name = 'lex';
  let password = '';
  $: isLoginDisabled = name.length === 0 || password.length === 0;
  let isLoading = false;

  onMount(() => {
    localStorage.clear();
  });

  const handleLoginClick = async () => {
    try {
      isLoading = true;

      const request = {
        name,
        password,
      };

      const response = await wretch().url(`${API_URL}/auth/login-admin`)
        .post(request)
        .json();

      appStore.update((prev) => ({ ...prev, user: { name: 'lex' } }));
      localStorage.setItem('token', response.tokenData.token);
      navigate('/admin-panel', { replace: true });
    } catch (e) {
      const error = JSON.parse(e.message);
      notificationStore.set({ message: error.message, type: 'error' });
    } finally {
      isLoading = false;
    }
  }
</script>

<style>
  .login-container {
    display: flex;
    flex-flow: column nowrap;
    background-color: var(--white-color);
    color: black;
    position: fixed;
    top: 25%;
    left: 25%;
    width: 50%;
    border: 1px solid black;
    border-radius: 10px;
    box-shadow: 5px 5px 2px 1px black;
    padding: 2%;
    font-size: 1em;
  }

  input {
    width: 100%;
    margin-top: 1%;
    outline: 0;
  }

  button {
    border-radius: 10px;
    background-color: var(--main-button-bg-color);
    margin-top: 2%;
  }
</style>

<div class="login-container">
  <label for="name">Имя</label>
  <input
    id="name"
    type="text"
    placeholder="Имя"
    bind:value={name}
  />
  <label for="password">Пароль</label>
  <input
    id="password"
    type="password"
    placeholder="Пароль"
    bind:value={password}
  />
  <button
    type="button"
    class="button"
    disabled={isLoginDisabled}
    on:click={handleLoginClick}
  >
    Войти
  </button>
  <Notification />
  {#if isLoading}
    <Loader />
  {/if}
</div>