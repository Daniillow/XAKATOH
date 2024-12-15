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

function startGame(difficulty) {
    window.location.href = `game.html?difficulty=${difficulty}`;
}