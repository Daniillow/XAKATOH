// Показ инструкции при нажатии на "Играть"
document.getElementById('play-button').addEventListener('click', () => {
    // Скрываем главное меню
    document.getElementById('main-menu').style.display = 'none';
    // Показываем инструкции
    document.getElementById('game-instruction').style.display = 'block';
});

// Показ меню выбора сложности после инструкции
document.getElementById('start-game-button').addEventListener('click', () => {
    // Скрываем инструкции
    document.getElementById('game-instruction').style.display = 'none';
    // Показываем меню выбора сложности
    document.getElementById('difficulty-menu').style.display = 'block';
});

// Удаление всех уведомлений при нажатии на "Понятно!"
document.getElementById('start-game-button').addEventListener('click', () => {
    // Удаляем все уведомления
    notifications.forEach(notification => {
        notification.remove();
    });
    notifications = []; // Очищаем массив уведомлений
});

// Начать игру при выборе сложности
document.getElementById('easy-button').addEventListener('click', () => {
    startGame('easy');
});

document.getElementById('medium-button').addEventListener('click', () => {
    startGame('medium');
});
const bgMusic = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle'); // Кнопка для включения/выключения музыки
const musicVolumeSlider = document.getElementById('music-volume-slider'); // Слайдер для громкости

// Сохранение состояния музыки
musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        localStorage.setItem('musicEnabled', 'true');
    } else {
        bgMusic.pause();
        localStorage.setItem('musicEnabled', 'false');
    }
});

// Сохранение громкости музыки
musicVolumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100; // Слайдер от 0 до 100, преобразуем в диапазон от 0.0 до 1.0
    bgMusic.volume = volume;
    localStorage.setItem('musicVolume', volume);
});



function startGame(difficulty) {
    const musicEnabled = bgMusic.paused ? 'false' : 'true';
    const musicVolume = bgMusic.volume;

    // Передача параметров через строку запроса
    window.location.href = `game.html?difficulty=${difficulty}&musicEnabled=${musicEnabled}&musicVolume=${musicVolume}`;
}
