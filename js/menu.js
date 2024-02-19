const menuUi = document.querySelector('.menu');
const settingsUi = document.querySelector('.settings');
const game = document.querySelector('.game');
const bestScoreElement = document.querySelector('.best-score');

const isChromiumBased = navigator.vendor.includes("Google Inc.");

const buttons = {
    start: document.querySelector('#start'),
    settings: document.querySelector('#settings'),
    exit: document.querySelector('#exit'),
    back: document.querySelector('#back'),
    keyBindings: document.querySelector('#key-bindings')
}

var musicStarted = false;

if (localStorage.getItem('PacMan_BestScore') === null)
    localStorage.setItem('PacMan_BestScore', 0);

if (localStorage.getItem('PacMan_MusicVolume') === null)
    localStorage.setItem('PacMan_MusicVolume', 50);

if (localStorage.getItem('PacMan_SoundVolume') === null)
    localStorage.setItem('PacMan_SoundVolume', 50);


Object.values(sounds).forEach(sound => {
    sound.volume = parseInt(localStorage.getItem('PacMan_SoundVolume')) / 100;
});
music.volume = parseInt(localStorage.getItem('PacMan_MusicVolume')) / 100;

window.addEventListener("click", () => {
    if (!musicStarted) {
        music.play();
        musicStarted = true;
    }
});

silders.music.value = localStorage.getItem('PacMan_MusicVolume');
silders.sound.value = localStorage.getItem('PacMan_SoundVolume');
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

buttons.exit.addEventListener('click', () => {
    sounds.slect.play();

    if (confirm('Are you sure you want to exit?'))
        window.close();
});

if (isChromiumBased) {
    buttons.exit.style.display = "none";
}