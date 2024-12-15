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

    if (game.queue.length < 3) {
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
        const clientButton = document.createElement("button");
        clientButton.textContent = `👤 ${client.name}  (${client.patience}%)`;  // Выводим имя пользователя

        // Проверка на активный заказ
        if (game.currentOrder && game.currentOrder.id === client.id) {
            clientButton.style.backgroundColor = "red";  // Красим кнопку в красный, если заказ активен
        } else {
            clientButton.style.backgroundColor = "";  // Сбрасываем цвет кнопки
        }

        clientButton.onclick = () => startOrder(client);  // Обработчик нажатия на кнопку
        queueDiv.appendChild(clientButton);
    });
}


function shiftPendingToQueue() {
    if (game.queue.length < 3 && game.pendingOrders.length > 0) {
        const nextOrder = game.pendingOrders.shift();
        game.queue.push(nextOrder);
        renderQueue();
        renderPendingOrders();
    }
}

function startOrder(client) {
    if (game.currentOrder) {
        // Если уже есть текущий заказ, сбрасываем стиль кнопки
        document.querySelectorAll("button").forEach(button => button.style.backgroundColor = "");
    }

    game.currentOrder = client;
    renderQueue();  // Обновляем очередь после выбора заказа

    const recipe = game.recipes[client.order];

    // Формируем список ингредиентов
    const ingredientsList = Object.entries(recipe)
        .map(([ingredient, amount]) => `${ingredient}: ${amount} мл`)
        .join(", ");

    // Отображаем заказ и его ингредиенты
    const orderDetailsDiv = document.getElementById("order-details");
    orderDetailsDiv.innerHTML = `
        <p>Клиент: ${client.name}</p>
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

// Функция для обновления содержимого чашки
// Функция для обновления содержимого чашки
function renderOrder() {
    const cupContents = document.getElementById('cup');

    if (selectedIngredients.length === 0) {
        cupContents.innerHTML = '<p>Перетащите сюда ингредиенты</p>';
    } else {
        // Собираем все ингредиенты в одну строку через пробел
        const ingredientsText = selectedIngredients
            .map(item => `${item.name} - ${item.quantity}`)  // Формируем строки "Название - Количество"
            .join(' ');  // Соединяем все строки через пробел

        cupContents.innerHTML = ingredientsText;  // Отображаем результат в чашке
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
            showNotification(`Гость ${client.name} ушел без заказа!`);
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

const ingredientSelect = document.getElementById('ingredient-select');
const quantitySlider = document.getElementById('quantity-slider');
const quantityDisplay = document.getElementById('quantity-display');

ingredientSelect.addEventListener('change', (event) => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    quantitySlider.min = selectedOption.dataset.min;
    quantitySlider.max = selectedOption.dataset.max;
    quantitySlider.step = selectedOption.dataset.step;
    quantitySlider.value = selectedOption.dataset.min;
    quantityDisplay.textContent = `${quantitySlider.value} мл`;
});

quantitySlider.addEventListener('input', () => {
    quantityDisplay.textContent = `${quantitySlider.value} мл`;
});

const ingredientText = document.getElementById('drag-ingredient');

ingredientSelect.addEventListener('change', () => {
    updateDragIngredientText();
});

quantitySlider.addEventListener('input', () => {
    updateDragIngredientText();
});

function updateDragIngredientText() {
    const ingredientName = ingredientSelect.value;
    const quantity = quantitySlider.value;
    ingredientText.textContent = `${ingredientName} - ${quantity} мл`;
}

// Добавляем обработчики кнопок выбора сложности
document.getElementById("easy").addEventListener("click", () => startGame("easy"));
document.getElementById("medium").addEventListener("click", () => startGame("medium"));

// Запуск игры
gameLoop();
renderQueue();