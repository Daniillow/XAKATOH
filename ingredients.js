// ingredients.js

quantityInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        const value = input.value;
        quantityDisplays[index].textContent = `${value} мл`;
    });
});

// Обработчик для сброса ингредиентов
document.getElementById('reset-ingredients').addEventListener('click', () => {
    if (selectedIngredients.length === 0) {
        showNotification("Чашка уже пуста, ничего сбрасывать не нужно!");
        return;
    }

    // Штраф за сброс ингредиентов
    const penalty = 5;
    if (game.score >= penalty) {
        game.score -= penalty;
    } else {
        game.score = 0;
    }

    showNotification(`Ингредиенты сброшены! Вы потеряли ${penalty} очков.`);

    // Очищаем чашку
    selectedIngredients.length = 0;
    cup.innerHTML = "<p>Перетащите сюда ингредиенты</p>";  // Очищаем визуально чашку
    renderOrder();  // Обновляем отображение чашки
    document.getElementById("score").textContent = `⭐ Очки: ${game.score}`;
});

// Функция сброса ингредиентов и текущего заказа
function resetOrder() {
    game.currentOrder = null; // Сбрасываем текущий заказ
    selectedIngredients.length = 0; // Очищаем ингредиенты
    document.getElementById("order-details").innerHTML = ""; // Очищаем контейнер текущего заказа
    renderOrder(); // Обновляем содержимое чашки
}