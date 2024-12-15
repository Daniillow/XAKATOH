const bgMusic = document.getElementById('background-music');

// Получение параметров из строки запроса
const params = new URLSearchParams(window.location.search);
const musicEnabled = params.get('musicEnabled'); // "true" или "false"
const musicVolume = parseFloat(params.get('musicVolume')); // число от 0 до 1

console.log(musicEnabled);
console.log(bgMusic.volume);
if (bgMusic) {
    // Настройка состояния музыки
    if (musicEnabled === 'false') {
        bgMusic.pause();
    } else {
        bgMusic.play();
    }

    // Настройка громкости, если параметр передан
    if (!isNaN(musicVolume)) {
        bgMusic.volume = musicVolume;
    }
}
console.log(bgMusic.volume);


