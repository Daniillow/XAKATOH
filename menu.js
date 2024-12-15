document.getElementById('play-button').addEventListener('click', () => {
    // Скрываем меню и показываем меню выбора сложности
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('difficulty-menu').style.display = 'block';
});

document.getElementById('easy-button').addEventListener('click', () => {
    startGame('easy');
});

document.getElementById('medium-button').addEventListener('click', () => {
    startGame('medium');
});

function startGame(difficulty) {
    // Перенаправляем на страницу игры и передаем уровень сложности через URL
    window.location.href = `game.html?difficulty=${difficulty}`;
}