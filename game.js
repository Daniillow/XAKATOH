// game.js

// Получаем параметр difficulty из URL

let gameDuration = 0; // Продолжительность игры в секундах
let orderInterval = 0; // Интервал появления заказов
let gameEndTimeout = null; // Таймер завершения игры
let orderIntervalID = null; // ID интервала для заказов
let gameTimerID = null; // ID таймера игрового цикла


const userNames = ["Влада", "Мария", "Иван", "Ольга", "Игорь", "Анна", "Максим", "Юлия", "Артур", "Дарья"];

const game = {
    timer: 0,
    score: 0,
    queue: [], // Текущие заказы (макс. 5)
    pendingOrders: [], // Очередь заказов
    currentOrder: null,
    recipes: {
        "Latte": { coffee: 50, milk: 150, syrup: 10 },
        "Espresso": { coffee: 100 },
        "Cappuccino": { coffee: 50, milk: 100 },
        "Moccona": { coffee: 50, milk: 100, chocolate: 20 },
        "Americano": { coffee: 100, water: 100 },
        "Macchiato": { coffee: 80, milkFoam: 20 },
        "Flat White": { coffee: 60, milk: 120 },
        "Irish Coffee": { coffee: 50, whiskey: 20, cream: 30 },
        "Affogato": { coffee: 50, iceCream: 50 }
    }
};

const availableIngredients = [
    { value: "coffee", name: "Кофе", min: 10, max: 100, step: 10 },
    { value: "milk", name: "Молоко", min: 10, max: 200, step: 10 },
    { value: "syrup", name: "Сироп", min: 10, max: 50, step: 10 },
    { value: "chocolate", name: "Шоколад", min: 10, max: 50, step: 10 },
    { value: "water", name: "Вода", min: 50, max: 200, step: 10 },
    { value: "milkFoam", name: "Молочная пена", min: 10, max: 50, step: 10 },
    { value: "whiskey", name: "Виски", min: 10, max: 30, step: 5 },
    { value: "cream", name: "Сливки", min: 10, max: 50, step: 10 },
    { value: "iceCream", name: "Мороженое", min: 10, max: 100, step: 10 }
];

const ingredientTranslations = {
    coffee: "Кофе",
    milk: "Молоко",
    syrup: "Сироп",
    chocolate: "Шоколад",
    water: "Вода",
    milkFoam: "Молочная пена",
    whiskey: "Виски",
    cream: "Сливки",
    iceCream: "Мороженое"
};

function translateIngredient(ingredient) {
    return ingredientTranslations[ingredient] || ingredient;
}


// Функция запуска игры
function startGame(selectedDifficulty) {
    document.getElementById("difficulty").style.display = "none"; // Скрываем выбор уровня
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

    // Скрываем текущие элементы игры
    document.getElementById("game-container").style.display = "none"; // Скрыть игру

    // Показываем меню завершения игры
    const gameOverMenu = document.getElementById("game-over-menu");
    gameOverMenu.style.display = "block";

    // Обновляем счет
    const finalScoreElement = document.getElementById("final-score");
    finalScoreElement.textContent = `Ваш счёт: ${game.score} очков`;
}

// Добавляем обработчик для кнопки "Играть снова"
document.getElementById("restart-button").addEventListener("click", () => {
    location.reload(); // Перезагружаем страницу для начала новой игры
});

// Добавляем обработчик для кнопки "В главное меню"
document.getElementById("main-menu-button").addEventListener("click", () => {
    window.location.href = "index.html"; // Перенаправляем в главное меню
});



// Функция для генерации случайного заказа с новыми рецептами
function addClient() {
    const randomUser = userNames[Math.floor(Math.random() * userNames.length)];
    const orders = Object.keys(game.recipes);
    const randomOrder = orders[Math.floor(Math.random() * orders.length)];
    const client = {
        id: Date.now(),
        name: randomUser,
        order: randomOrder,
        patience: 100 // Процент терпения
    };

    if (game.queue.length < 3) {
        game.queue.push(client);
    } else {
        game.pendingOrders.push(client);
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
        .map(([ingredient, amount]) => `${translateIngredient(ingredient)}: ${amount} мл`)  // Переводим названия
        .join(', ');  // Разделяем ингредиенты запятой



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
        // Переводим ингредиент в его отображаемое название (например, 'coffee' -> 'Кофе')
        const translatedIngredient = translateIngredient(ingredient);

        // Находим все выбранные ингредиенты, которые соответствуют переведенному названию
        const totalAmount = selectedIngredients
            .filter(item => item.name === translatedIngredient)
            .reduce((sum, item) => sum + parseInt(item.quantity), 0);

        return totalAmount === requiredAmount;
    });
}



// Функция для обновления содержимого чашки
function renderOrder() {
    const cupContents = document.getElementById('cup');

    if (selectedIngredients.length === 0) {
        cupContents.innerHTML = '<p>Перетащите сюда ингредиенты</p>';
    } else {
        // Собираем все ингредиенты в одну строку через пробел, учитывая количество каждого
        const ingredientsText = selectedIngredients
            .map(item => `${translateIngredient(item.name)} - ${item.quantity} мл`)  // Переводим название
            .join(', ');  // Объединяем строки

        cupContents.innerHTML = ingredientsText;  // Отображаем результат в чашке
    }
}


document.getElementById('complete-order').addEventListener('click', () => {
    // Проверяем, выбран ли клиент и есть ли ингредиенты для заказа
    if (!game.currentOrder || selectedIngredients.length === 0) {
        showNotification("Выберите клиента и ингредиенты для выполнения заказа!");
        return;
    }

    const recipe = game.recipes[game.currentOrder.order];
    const isCorrect = isOrderValid(recipe, selectedIngredients);

    if (isCorrect) {
        // Вычисление баллов
        const scoreBonus = calculateScore(game.currentOrder.order, game.currentOrder.patience);
        game.score += scoreBonus;

        showNotification(`Заказ гостя ${game.currentOrder.name} выполнен успешно! Вы заработали ${scoreBonus} очков.`);

        // Удаляем клиента из очереди
        const clientIndex = game.queue.findIndex(client => client.id === game.currentOrder.id);
        if (clientIndex !== -1) {
            game.queue.splice(clientIndex, 1); // Удаляем клиента
        }

        resetOrder(); // Сбрасываем текущий заказ
        renderQueue(); // Обновляем очередь
    } else {
        showNotification(`Ошибка в заказе у гостя ${game.currentOrder.name}. Проверьте пропорции.`);
    }
});



// Функция проверки выполнения заказа
function checkOrder() {
    const currentRecipe = game.recipes[game.currentOrder.order];
    const isCorrect = isOrderValid(currentRecipe, selectedIngredients);

    if (isCorrect) {
        // Вычисление баллов
        const scoreBonus = calculateScore(game.currentOrder.order, game.currentOrder.patience);

        // Увеличиваем счет на количество баллов
        game.score += scoreBonus;

        showNotification(`Заказ выполнен правильно! Вы заработали ${scoreBonus} очков.`);

        // Убираем клиента из очереди
        const clientIndex = game.queue.findIndex(client => client.id === game.currentOrder.id);
        if (clientIndex !== -1) {
            game.queue.splice(clientIndex, 1); // Удаляем клиента
        }

        resetOrder(); // Сбрасываем текущий заказ
        renderQueue(); // Обновляем очередь
    } else {
        showNotification(`Ошибка в заказе! Проверьте пропорции.`);
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

            // Убираем текущий заказ, если клиент был активным
            if (game.currentOrder && game.currentOrder.id === client.id) {
                game.currentOrder = null;

                // Очищаем содержимое контейнера "Текущий заказ"
                document.getElementById("order-details").innerHTML = "";
            }

            // Удаляем клиента из очереди
            game.queue.splice(index, 1);

            // Штраф за уход клиента
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



const ingredientSelect = document.getElementById('ingredient-select');
const quantitySlider = document.getElementById('quantity-slider');
const quantityDisplay = document.getElementById('quantity-display');

ingredientSelect.addEventListener('change', () => {
    const selectedOption = ingredientSelect.options[ingredientSelect.selectedIndex];
    const min = parseInt(selectedOption.dataset.min);
    const max = parseInt(selectedOption.dataset.max);
    const step = parseInt(selectedOption.dataset.step);

    quantitySlider.min = min;
    quantitySlider.max = max;
    quantitySlider.step = step;
    quantitySlider.value = min;

    quantityDisplay.textContent = `${min} мл`;
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

// Функция для вычисления баллов за заказ
function calculateScore(order, patience) {
    let baseScore = 10; // Базовые баллы за выполнение заказа

    // Добавляем бонус в зависимости от сложности рецепта
    const recipe = game.recipes[order];
    const complexityBonus = Object.keys(recipe).length * 2; // Например, каждый ингредиент увеличивает сложность на 2 балла
    baseScore += complexityBonus;

    // Добавляем бонус в зависимости от терпения клиента
    const patienceBonus = Math.floor(patience / 10); // Бонус за терпение (чем больше терпение, тем больше бонус)
    baseScore += patienceBonus;

    return baseScore;
}

function updateDragIngredientText() {
    const ingredientName = ingredientSelect.value;
    const quantity = quantitySlider.value;
    ingredientText.textContent = `${translateIngredient(ingredientName)} - ${quantity} мл`;
}

availableIngredients.forEach(ingredient => {
    const option = document.createElement('option');
    option.value = ingredient.value;
    option.textContent = ingredient.name;
    option.dataset.min = ingredient.min;
    option.dataset.max = ingredient.max;
    option.dataset.step = ingredient.step;
    ingredientSelect.appendChild(option);
});

startGame(difficulty);
