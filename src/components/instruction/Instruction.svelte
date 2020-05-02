<script>
  import { createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  const dispatch = createEventDispatcher();
</script>

<style>
  .instruction-container {
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
    margin-bottom: 50px;
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
    margin-top: 20px;
    width: 90%;
    font-size: 18px;
  }

  a {
    margin-top: 20px;
    color: var(--light-yellow);
    text-decoration: underline;
  }

  .yellow {
    color: var(--light-yellow);
  }

  .header {
    margin: 0;
  }

  .stub {
    height: 100px;
  }

  @media screen and (max-width: 1024px) {
    .instruction-container {
      width: 80%;
      left: 10%;
    }
  }

  @media screen and (max-width: 500px) {
    .instruction-container {
      width: 100%;
      left: 0;
    }
  }
</style>

<div
  class="instruction-container"
  transition:slide="{{delay: 50, duration: 500, easing: quintOut }}"
>
  <div class="header">
    <h1>Конструктор</h1>
    <h2>4 фото 1 слово</h2>
  </div>
  <div>
    Данный конструктор позволяет создать кандидата на задание в моей новой игре 
    <span class="yellow">4 фото 1 слово</span>.
  </div>
  <div>
    Вообще, данную игру я уже когда-то делал - с ней и с её смыслом можно ознакомиться по ссылке ниже.
  </div>
  <a
    href="https://play.google.com/store/apps/details?id=com.TheMinStudios.FourPhoto_OneWord"
    target="_blank"
  >
    Ссылка на старую игру
  </a>
  <div>
    Учитывая, что я был не особо умным мальчиком в прошлом, я профукал исходники старой игры
    (не спрашивайте как, мне до сих пор стыдно). Поэтому я решил сделать, как это любят назы&shy;вать
    большие дяди с боль&shy;ших игро&shy;вых сту&shy;дий, ремас&shy;те&shy;ринг. Создать "4 фото 1 слово",
    но с новым контентом и более сим&shy;патичным интер&shy;фей&shy;сом.
  </div>
  <div>
    И чтобы быстрее собрать кон&shy;тент (а это больше 1000 изо&shy;бра&shy;жений), я решил создать этот
    кон&shy;струк&shy;тор и по&shy;про&shy;сить о помощи тебя, мой доро&shy;гой подпис&shy;чик.
    Добавь своего кан&shy;дидата на уровень, и я включу тебя в игру как соавтора - твое имя и ссылка
    на профиль в со&shy;ци&shy;альной сети будут добав&shy;лены в твой уровень в игре, и если игра стрельнет,
    как предыду&shy;щая (а это, на мину&shy;точку, 160к скачи&shy;ваний), тебя и твою работу увидит много людей.
  </div>
  <div>
    Поэтому, не откладывай ни на минуту пилинг контента, жми на кнопку "Начать".
  </div>
  <div class="button-container">
    <button type="button" on:click={() => dispatch('closeInstructionEvent')}>Начать</button>
  </div>
  <div class="stub">&nbsp;</div>
</div>
