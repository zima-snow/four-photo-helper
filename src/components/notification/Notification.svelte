<script>
  import { notificationStore } from './store.js';
  import { NOTIFICATIONS_BG_COLORS } from '../../consts/common.js';

  const handleCloseNotification = () => {
    notificationStore.set({ message: '', type: '', });
  }
</script>

<style>
  .notification {
    display: var(--display);
    background-color: var(--bgColor);
    color: black;
    position: fixed;
    top: 10%;
    width: 25%;
    border: 1px solid black;
    border-radius: 10px;
    box-shadow: 5px 5px 2px 1px black;
    padding: 2%;
    z-index: 9999;
    word-break: break-word;
    font-size: 1.1em;
  }

  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 10%;
  }

  button {
    border-radius: 10px;
    border: 1px solid black;
  }

  @media screen and (max-width: 500px) {
    .notification {
      width: 80%;
    }
  }
</style>

<div
  class="notification"
  style="--display:{$notificationStore.message.length === 0 ? 'none' : 'block'}; --bgColor:{NOTIFICATIONS_BG_COLORS[$notificationStore.type]}"
  on:click={handleCloseNotification}
>
  <div>{$notificationStore.message}</div>
  <div class="button-container">
    <button type="button">Закрыть</button>
  </div>
</div>