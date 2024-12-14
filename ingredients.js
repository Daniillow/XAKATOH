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

    // Очищаем ингредиенты и обновляем интерфейс
    selectedIngredients.length = 0;
    cup.innerHTML = "<p>Перетащите сюда ингредиенты</p>";
    document.getElementById("score").textContent = `⭐ Очки: ${game.score}`;
    
});
// Функция сброса ингредиентов и текущего заказа
function resetOrder() {
    selectedIngredients.length = 0; // Очищаем массив ингредиентов
    cup.innerHTML = "<p>Перетащите сюда ингредиенты</p>"; // Очищаем визуально чашку
    game.currentOrder = null; // Сбрасываем текущий заказ
    renderOrder(); // Обновляем интерфейс заказа
    renderQueue(); // Обновляем очередь клиентов
}
