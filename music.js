const bgMusic = document.getElementById('background-music');

// Применяем настройки из localStorage
window.addEventListener('load', () => {
    const savedMusicEnabled = localStorage.getItem('musicEnabled');
    const savedMusicVolume = localStorage.getItem('musicVolume');

    if (bgMusic) {
        if (savedMusicEnabled === 'false') {
            bgMusic.pause();
        } else {
            bgMusic.play();
        }

        if (savedMusicVolume !== null) {
            bgMusic.volume = parseFloat(savedMusicVolume);
        }
    }
});
