// drag-and-drop.js

// Обработчики для перетаскивания ингредиентов
ingredients.forEach(ingredient => {
    ingredient.addEventListener('dragstart', handleDragStart);
    ingredient.addEventListener('dragend', handleDragEnd);
});

function handleDragStart(event) {
    const ingredientName = event.target.dataset.name;
    const quantityInput = document.querySelector(`.quantity[data-name="${ingredientName}"]`);
    const quantity = quantityInput.value;
    event.dataTransfer.setData('text/plain', JSON.stringify({ name: ingredientName, quantity }));
    event.target.style.opacity = '0.5';
}

function handleDragEnd(event) {
    event.target.style.opacity = '1';
}

cup.addEventListener('dragover', (event) => {
    event.preventDefault();
    cup.classList.add('dragover');
});

cup.addEventListener('dragleave', () => {
    cup.classList.remove('dragover');
});

cup.addEventListener('drop', (event) => {
    event.preventDefault();
    cup.classList.remove('dragover');
    const ingredientData = JSON.parse(event.dataTransfer.getData('text/plain'));
    if (ingredientData) {
        selectedIngredients.push(ingredientData);
        const ingredientDiv = document.createElement('div');
        ingredientDiv.textContent = `${ingredientData.name} - ${ingredientData.quantity} мл`;
        ingredientDiv.style.fontSize = '12px';
        ingredientDiv.style.margin = '5px';
        cup.appendChild(ingredientDiv);
    }
});
