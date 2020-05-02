<script>
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  const dispatch = createEventDispatcher();
</script>

<style>
  .example-container {
		display: flex;
    flex-direction: column;
		align-items: center;
		justify-content: flex-start;
    text-align: justify;
    word-break: break-word;
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
    overflow-y: scroll;
	}

  .button-container {
    margin-top: 10px;
    height: 100px;
    display: flex;
    justify-content: center;
  }

  button {
    width: 50%;
    background-color: var(--main-button-bg-color);
    border-radius: 10px;
    position: absolute;
  }

  div {
    width: 90%;
    font-size: 18px;
  }

  .header {
    margin: 0;
  }

  img {
    width: 75%;
    height: 90%;
    margin-bottom: 5%;
  }

  .stub {
    height: 150px;
  }

  @media screen and (max-width: 1024px) {
    .example-container {
      width: 80%;
      left: 10%;
    }

    img {
      width: 75%;
      height: 100%;
    }
  }

  @media screen and (max-width: 500px) {
    .example-container {
      width: 100%;
      left: 0;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>

<div
  class="example-container"
  transition:slide="{{delay: 50, duration: 500, easing: quintOut }}"
>
  <div class="header">
    <h2>Пример кандидата</h2>
  </div>
  <img
    src="https://for-alexander.tk/images/candidate_example.png"
    alt="Ошибка при загрузке примера"
  />
  <div>
    Имя (ник) и ссылку на профиль социальной сети вводить необязательно.
  </div>
  <div class="button-container">
    <button type="button" on:click={() => dispatch('closeExampleEvent')}>Понятно</button>
  </div>
  <div class="stub">&nbsp;</div>
</div>
