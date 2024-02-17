const menuUi = document.querySelector('.menu');
const settingsUi = document.querySelector('.settings');
const game = document.querySelector('.game');
const bestScoreElement = document.querySelector('.best-score');

const buttons = {
    start: document.querySelector('#start'),
    settings: document.querySelector('#settings'),
    exit: document.querySelector('#exit'),
    back: document.querySelector('#back'),
    keyBindings: document.querySelector('#key-bindings')
}

music.play();

Object.values(sounds).forEach(sound => {
    sound.volume = silders.sound.value / 100;
});

if (localStorage.getItem('PacMan_BestScore') === null)
    localStorage.setItem('PacMan_BestScore', 0);

bestScoreElement.innerText = localStorage.getItem('PacMan_BestScore');

buttons.start.addEventListener('click', () => {
    menuUi.style.display = 'none';
    game.style.display = 'block';

    sounds.slect.play();

    start();
});

buttons.settings.addEventListener('click', () => {
    sounds.slect.play();
    menuUi.style.display = 'none';
    settingsUi.style.display = 'flex';
});

buttons.back.addEventListener('click', () => {
    sounds.slect.play();
    settingsUi.style.display = 'none';
    menuUi.style.display = 'flex';
});

buttons.exit.addEventListener('click', () => {
    sounds.slect.play();
    window.close();
});