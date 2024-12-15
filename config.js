// config.js
// Получаем параметр из URL
const urlParams = new URLSearchParams(window.location.search);
const difficulty = urlParams.get('difficulty');



let settings = {
    easy: { orderInterval: 11000, gameDuration: 90 },
    medium: { orderInterval: 9000, gameDuration: 90 },
    hard: { orderInterval: 7000, gameDuration: 90 }
};

