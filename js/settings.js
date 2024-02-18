const soundText = document.querySelector('#sound-level');
const musicText = document.querySelector('#music-level');
const keySelect = document.querySelector('.key-select');

const keyBindButton = document.querySelector('#key-bindings');
const backButton = document.querySelector('#back');

const keys = document.querySelectorAll('.key[selected]');



const keyBindings = {
    up: keys[0].value,
    right: keys[1].value,
    down: keys[2].value,
    left: keys[3].value
}

const silders = {
    music: document.querySelector('#music'),
    sound: document.querySelector('#sound')
}

silders.music.value = 50;
silders.sound.value = 50;

soundText.innerHTML = `${silders.sound.value}%`;
musicText.innerHTML = `${silders.music.value}%`;

silders.music.addEventListener('input', () => {
    music.volume = silders.music.value / 100;

    if (silders.music.value == 0) {
        musicText.innerHTML = "Off";
    } else {
        musicText.innerHTML = `${silders.music.value}%`;
    }

    localStorage.setItem('PacMan_MusicVolume', silders.music.value);
});

silders.sound.addEventListener('input', () => {
    Object.values(sounds).forEach(sound => {
        sound.volume = silders.sound.value / 100;
    });



    if (silders.sound.value == 0) {
        soundText.innerHTML = "Off";
    } else {
        soundText.innerHTML = `${silders.sound.value}%`;
    }

    localStorage.setItem('PacMan_SoundVolume', silders.sound.value);
});

const keySelectEventHandler = () => {
    keySelect.style.display = 'none';
    keySelect.style.animation = 'slideIn 0.5s ease-in forwards';
    settingsUi.style.transform = 'translateY(20%)';
    keySelect.removeEventListener('animationend', keySelectEventHandler);
}

keyBindButton.addEventListener('click', () => {

    sounds.slect.play();
    backButton.style.animation = 'slideDown .2s ease-in-out forwards';

    if (keySelect.style.display === 'flex') {
        backButton.style.animation = 'slideUp .5s ease-in-out forwards';
        backButton.style.transform = 'translateY(0%)';
        keySelect.style.animation = 'slideOut 0.5s ease-in forwards';

        keyBindingSettingsChange();

        keySelect.addEventListener('animationend', keySelectEventHandler);
    } else {
        backButton.style.animation = 'animation: slideDown .7s ease-in-out forwards';
        keySelect.style.display = 'flex';
        settingsUi.style.transform = 'translateY(2%)';
        backButton.style.transform = 'translateY(80%)';
    }

});



backButton.addEventListener('click', () => {
    keyBindingSettingsChange();

    sounds.slect.play();
    settingsUi.style.display = 'none';
    menuUi.style.display = 'flex';
});

const keyBindingSettingsChange = () => {
    const initialKeyBindings = {
        up: keyBindings.up,
        right: keyBindings.right,
        down: keyBindings.down,
        left: keyBindings.left
    }
    const selectElements = document.querySelectorAll('select');

    function hasUserMadeChanges() {
        for (const select of selectElements) {
            if (select.value !== initialKeyBindings[select.id]) {
                return true;
            }
        }
        return false;
    }
    if (hasUserMadeChanges()) {
        keyBindings.up = selectElements[0].value;
        keyBindings.right = selectElements[1].value;
        keyBindings.down = selectElements[2].value;
        keyBindings.left = selectElements[3].value;
    }
}