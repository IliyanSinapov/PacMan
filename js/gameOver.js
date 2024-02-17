const gameOverScreen = document.querySelector('.game-over');
const gameScore = document.querySelector('.game-score');

const restart = document.querySelector('#restart');
const close = document.querySelector('#menu');

restart.addEventListener('click', () => {
    gameOver = false;
    music.pause();
    sounds.slect.play();
    gameOverScreen.style.display = 'none';
    game.style.display = 'block';
    start();
});

close.addEventListener('click', () => {
    sounds.slect.play();
    gameOverScreen.style.display = 'none';
    menuUi.style.display = 'flex';
});

var isGameOver = false;

const renderGameOverScreen = () => {
    if (isGameOver) {
        return;
    }

    if (player.score > parseInt(localStorage.getItem('PacMan_BestScore'))){
        localStorage.setItem('PacMan_BestScore', player.score);
    }

    game.style.display = 'none';
    gameOverScreen.style.display = 'flex';
    gameScore.innerText = player.score;
    music.src = '../assets/sounds/menu.wav';
    
    isGameOver = true;
}