// config.js
// Получаем параметр из URL
const urlParams = new URLSearchParams(window.location.search);
const difficulty = urlParams.get('difficulty');



let settings = {
    easy: { orderInterval: 25000, gameDuration: 180 },
    medium: { orderInterval: 5000, gameDuration: 60 }
};

