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

// Массив для хранения уведомлений
let notifications = [];

// Уведомления показываются только при первом нажатии "Играть"
let notificationsShown = false;
document.getElementById('play-button').addEventListener('click', () => {
    if (!notificationsShown) {
        notificationsShown = true;

        setTimeout(() => notifications.push(showNotification('Тут будет появляться заказ, который можно выбрать', '19%', '25%')), 500);
        setTimeout(() => notifications.push(showNotification('Тут находится текущий заказ', '19%', '55%')), 1000);
        setTimeout(() => notifications.push(showNotification('Выбор ингредиентов', '30%', '32%')), 1500);
        setTimeout(() => notifications.push(showNotification('Регулировка количества ингредиентов', '30%', '45%')), 2000);
        setTimeout(() => notifications.push(showNotification('Блок для перетаскивания ингредиентов', '43%', '55%')), 2500);
    }
});

// Функция для показа уведомлений
function showNotification(text, top, left) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = text;
    notification.style.top = top;
    notification.style.left = left;

    document.body.appendChild(notification);
    return notification;
}

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