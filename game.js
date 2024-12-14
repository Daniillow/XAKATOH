// game.js

let difficulty = null; // Уровень сложности
let gameDuration = 0; // Продолжительность игры в секундах
let orderInterval = 0; // Интервал появления заказов
let gameEndTimeout = null; // Таймер завершения игры
let orderIntervalID = null; // ID интервала для заказов
let gameTimerID = null; // ID таймера игрового цикла

const userNames = ["Алексей", "Мария", "Иван", "Ольга", "Дмитрий", "Екатерина", "Максим", "Юлия", "Артур", "Наталья"];

const game = {
    timer: 0,
    score: 0,
    queue: [], // Текущие заказы (макс. 5)
    pendingOrders: [], // Очередь заказов
    currentOrder: null,
    recipes: {
        "Latte": { coffee: 50, milk: 150, syrup: 10 },
        "Espresso": { coffee: 100 },
        "Cappuccino": { coffee: 50, milk: 100 }
    }
};


// Функция запуска игры
function startGame(selectedDifficulty) {
    difficulty = selectedDifficulty;
    const settings = {
        easy: { orderInterval: 25000, gameDuration: 180 },
        medium: { orderInterval: 5000, gameDuration: 120 }
    };
    const { orderInterval, gameDuration } = settings[difficulty];

    document.getElementById("difficulty").style.display = "none"; // Скрываем выбор уровня
    showNotification(`Игра началась! Уровень сложности: ${difficulty === "easy" ? "Лёгкий" : "Средний"}`);

    // Инициализация начальных заказов
    for (let i = 0; i < 1; i++) { // Добавим 3 заказа сразу
        addClient();
    }

    // Запускаем добавление заказов с интервалом
    orderIntervalID = setInterval(addClient, orderInterval);

    // Запускаем игровой цикл
    gameTimerID = setInterval(gameLoop, 1000);

    // Устанавливаем таймер окончания игры
    gameEndTimeout = setTimeout(endGame, gameDuration * 1000);
}


// Функция завершения игры
function endGame() {
    clearInterval(orderIntervalID); // Останавливаем добавление заказов
    clearInterval(gameTimerID); // Останавливаем игровой цикл
    clearTimeout(gameEndTimeout); // Сбрасываем таймер игры

    // Выводим итоговый результат
    document.getElementById("result").style.display = "block";
    document.getElementById("result").textContent = `Игра окончена! Ваш счёт: ${game.score} очков. Спасибо за игру!`;
}

function gameLoop() {
    game.timer++;
    document.getElementById("timer").textContent = `⏳ Время: ${Math.floor(game.timer / 60)}:${game.timer % 60}`;
    document.getElementById("score").textContent = `⭐ Очки: ${game.score}`;

    // Уменьшаем терпение клиентов
    game.queue.forEach((client, index) => {
        client.patience -= 3;
        if (client.patience <= 0) {
            showNotification(`Клиент с заказом "${client.order}" ушел!`);
            if (game.currentOrder && game.currentOrder.id === client.id) {
                game.currentOrder = null; // Сбрасываем текущий заказ
            }
            game.queue.splice(index, 1); // Удаляем клиента из очереди
            const penalty = 10;
            if (game.score >= penalty) {
                game.score -= penalty;
            } else {
                game.score = 0; // Не допускаем отрицательных очков
            }
        }
    });

    renderQueue();
}

// Функция для создания нового клиента
function addClient() {
    // Генерация случайного имени пользователя
    const randomUser = userNames[Math.floor(Math.random() * userNames.length)];

    const orders = Object.keys(game.recipes);
    const randomOrder = orders[Math.floor(Math.random() * orders.length)];
    const client = {
        id: Date.now(),
        name: randomUser,  // Используем случайное имя вместо заказа кофе
        order: randomOrder,
        patience: 100 // Процент терпения
    };

    if (game.queue.length < 5) {
        game.queue.push(client); // Добавляем в текущие заказы
    } else {
        game.pendingOrders.push(client); // Отправляем в ожидание
    }

    renderQueue();
    renderPendingOrders();
}


// Отображение клиентов в очереди
function renderQueue() {
    const queueDiv = document.getElementById("queue");
    queueDiv.innerHTML = ""; // Очистить очередь
    game.queue.forEach(client => {
        const clientDiv = document.createElement("div");
        clientDiv.textContent = `👤 ${client.name}  (${client.patience}%)`;  // Выводим имя пользователя
        clientDiv.onclick = () => startOrder(client);
        queueDiv.appendChild(clientDiv);
    });
}


function shiftPendingToQueue() {
    if (game.queue.length < 5 && game.pendingOrders.length > 0) {
        const nextOrder = game.pendingOrders.shift();
        game.queue.push(nextOrder);
        renderQueue();
        renderPendingOrders();
    }
}

function startOrder(client) {
    game.currentOrder = client;
    const recipe = game.recipes[client.order];

    // Формируем список ингредиентов
    const ingredientsList = Object.entries(recipe)
        .map(([ingredient, amount]) => `${ingredient}: ${amount} мл`)
        .join(", ");

    // Отображаем заказ и его ингредиенты
    const orderDetailsDiv = document.getElementById("order-details");
    orderDetailsDiv.innerHTML = `
        <p>Клиент: ${client.id}</p>
        <p>Заказ: ${client.order}</p>
        <p>Ингредиенты: ${ingredientsList}</p>
    `;
}


function isOrderValid(recipe, selectedIngredients) {
    return Object.entries(recipe).every(([ingredient, requiredAmount]) => {
        const totalAmount = selectedIngredients
            .filter(item => item.name === ingredient)
            .reduce((sum, item) => sum + parseInt(item.quantity), 0);
        return totalAmount === requiredAmount;
    });
}

function renderOrder() {
    const orderDetails = document.getElementById('current-order-details');
    const cupContents = document.getElementById('cup-contents');

    if (!game.currentOrder) {
        orderDetails.textContent = 'Выберите клиента, чтобы начать заказ';
        cupContents.innerHTML = '<p>Перетащите сюда ингредиенты</p>';
        return;
    }

    // Информация о заказе
    const recipe = game.recipes[game.currentOrder.order];
    const ingredientsList = Object.entries(recipe)
        .map(([ingredient, amount]) => `${ingredient}: ${amount} мл`)
        .join(', ');

    orderDetails.textContent = `Заказ: ${game.currentOrder.order} (Ингредиенты: ${ingredientsList})`;

    // Содержимое чашки
    if (selectedIngredients.length === 0) {
        cupContents.innerHTML = '<p>Перетащите сюда ингредиенты</p>';
    } else {
        cupContents.innerHTML = '';
        selectedIngredients.forEach(item => {
            const ingredientDiv = document.createElement('div');
            ingredientDiv.textContent = `${item.name} - ${item.quantity} мл`;
            ingredientDiv.style.fontSize = '12px';
            cupContents.appendChild(ingredientDiv);
        });
    }
}

// Вызывать renderOrder после изменений текущего заказа или добавления ингредиентов
document.getElementById('complete-order').addEventListener('click', () => {
    // Проверка и завершение заказа
    if (game.currentOrder) {
        renderOrder();
    }
});


// Функция проверки выполнения заказа
function checkOrder() {
    const currentRecipe = game.recipes[game.currentOrder.order];
    const recipeKeys = Object.keys(currentRecipe);
    const isCorrect = recipeKeys.every(key => {
        const requiredAmount = currentRecipe[key];
        const totalAmount = selectedIngredients
            .filter(ingredient => ingredient.name === key)
            .reduce((sum, ingredient) => sum + parseInt(ingredient.quantity), 0);

        return totalAmount === requiredAmount;
    });

    if (isCorrect) {
        showNotification('Заказ выполнен правильно!');
        game.score += 10;
        game.queue.shift(); // Убираем клиента
        selectedIngredients.length = 0; // Очищаем чашку
        renderQueue();
        renderOrder();
    } else {
        showNotification('Ошибка! Проверьте рецепт.');
    }
}


function gameLoop() {
    game.timer++;
    document.getElementById("timer").textContent = `⏳ Время: ${Math.floor(game.timer / 60)}:${game.timer % 60}`;
    document.getElementById("score").textContent = `⭐ Очки: ${game.score}`;

    // Уменьшаем терпение клиентов
    game.queue.forEach((client, index) => {
        client.patience -= 3;
        if (client.patience <= 0) {
            showNotification(`Клиент с заказом "${client.order}" ушел!`);
            if (game.currentOrder && game.currentOrder.id === client.id) {
                game.currentOrder = null; // Сбрасываем текущий заказ
            }
            game.queue.splice(index, 1); // Удаляем клиента из очереди
            const penalty = 10;
            game.score = Math.max(game.score - penalty, 0);
        }
    });

    shiftPendingToQueue(); // Проверяем очередь ожидания
    renderQueue();
}

function renderPendingOrders() {
    const pendingDiv = document.getElementById("pending-orders");
    pendingDiv.innerHTML = `<p>Заказы в очереди: ${game.pendingOrders.length}</p>`;
}

// Переменные для хранения выбранных ингредиентов и их количества
const selectedIngredients = [];
const ingredients = document.querySelectorAll('.ingredient');
const cup = document.getElementById('cup');
const quantityInputs = document.querySelectorAll('.quantity');
const quantityDisplays = document.querySelectorAll('.quantity-display');

// Обновление отображения количества при изменении ползунка
quantityInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        const value = input.value;
        quantityDisplays[index].textContent = `${value} мл`;
    });
});





// Обработчик завершения заказа
document.getElementById('complete-order').addEventListener('click', () => {
    if (!game.currentOrder) {
        showNotification("Выберите клиента для выполнения заказа!");
        return;
    }

    const recipe = game.recipes[game.currentOrder.order];
    if (isOrderValid(recipe, selectedIngredients)) {
        showNotification(`Заказ "${game.currentOrder.order}" выполнен успешно!`);
        game.score += 10;
        // Найти индекс текущего клиента в очереди и удалить его
        const clientIndex = game.queue.findIndex(client => client.id === game.currentOrder.id);
        if (clientIndex !== -1) {
            game.queue.splice(clientIndex, 1); // Удаляем из очереди
        }
        resetOrder();
    } else {
        showNotification(`Ошибка в заказе "${game.currentOrder.order}". Проверьте пропорции.`);
    }
});

// Обработка начала перетаскивания на мобильных устройствах
ingredients.forEach(ingredient => {
    ingredient.addEventListener('touchstart', handleTouchStart);
});

function handleTouchStart(event) {
    const ingredientName = event.target.dataset.name;
    const quantityInput = document.querySelector(`.quantity[data-name="${ingredientName}"]`);
    const quantity = quantityInput.value;

    // Печатаем данные об ингредиенте для тестирования
    console.log('Начало перетаскивания ингредиента:', ingredientName, quantity);

    // Сохраняем информацию об ингредиенте, который перетаскивается
    event.target.style.opacity = '0.5'; // Делаем элемент полупрозрачным

    // Добавляем события касания для перемещения
    event.target.addEventListener('touchmove', handleTouchMove);
    event.target.addEventListener('touchend', handleTouchEnd);
}

function handleTouchMove(event) {
    const ingredient = event.target;

    // Изменяем позицию ингредиента, чтобы следить за перемещением пальца
    const touch = event.touches[0];
    ingredient.style.position = 'absolute';
    ingredient.style.left = `${touch.clientX - ingredient.offsetWidth / 2}px'`;
    ingredient.style.top = `${touch.clientY - ingredient.offsetHeight / 2}px`;

    event.preventDefault(); // Чтобы предотвратить стандартное поведение
}

function handleTouchEnd(event) {
    const ingredient = event.target;

    // Восстановим исходную прозрачность и позицию
    ingredient.style.opacity = '1';
    ingredient.style.position = 'initial';

    // Проверим, если элемент находится внутри чашки
    const touch = event.changedTouches[0];
    const cup = document.getElementById('cup');
    const cupRect = cup.getBoundingClientRect();
    const ingredientRect = ingredient.getBoundingClientRect();

    if (
        touch.clientX > cupRect.left &&
        touch.clientX < cupRect.right &&
        touch.clientY > cupRect.top &&
        touch.clientY < cupRect.bottom
    ) {
        // Если элемент в чашке, добавляем его в выбранные ингредиенты
        const ingredientData = {
            name: ingredient.dataset.name,
            quantity: document.querySelector(`.quantity[data-name="${ingredient.dataset.name}"]`).value
        };

        selectedIngredients.push(ingredientData);

        // Отображение добавленного ингредиента в чашке
        const ingredientDiv = document.createElement('div');
        ingredientDiv.textContent = `${ingredientData.name} - ${ingredientData.quantity} мл`;
        ingredientDiv.style.fontSize = '12px';
        ingredientDiv.style.margin = '5px';
        cup.appendChild(ingredientDiv);

        console.log('Ингредиенты в чашке:', selectedIngredients);
    }

    // Удаляем события касания
    ingredient.removeEventListener('touchmove', handleTouchMove);
    ingredient.removeEventListener('touchend', handleTouchEnd);
}


// Добавляем обработчики кнопок выбора сложности
document.getElementById("easy").addEventListener("click", () => startGame("easy"));
document.getElementById("medium").addEventListener("click", () => startGame("medium"));

// Запуск игры
gameLoop();
