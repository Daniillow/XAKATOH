// drag-and-drop.js

// Слушатель события dragstart для #drag-ingredient
ingredientText.addEventListener('dragstart', (event) => {
    const ingredientName = ingredientText.textContent.split(' - ')[0];  // Имя ингредиента, например "Кофе"
    const quantity = parseInt(ingredientText.textContent.split(' - ')[1]);  // Количество, например "50 мл"

    // Используем translateIngredient для получения русского названия ингредиента
    const translatedName = translateIngredient(ingredientName);

    const ingredientData = {
        name: translatedName,  // Имя ингредиента на русском
        quantity: quantity,    // Количество
    };

    // Сохраняем данные о ингредиенте в dataTransfer
    event.dataTransfer.setData('text/plain', JSON.stringify(ingredientData));
});

// Слушатель события drop для чашки
cup.addEventListener('dragover', (event) => {
    event.preventDefault();  // Разрешаем сброс
});

// Слушатель события drop для чашки
cup.addEventListener('drop', (event) => {
    event.preventDefault();

    // Извлекаем данные из dataTransfer
    const ingredientData = JSON.parse(event.dataTransfer.getData('text/plain'));

    // Проверяем, если такой ингредиент уже есть в чашке
    const existingIngredient = selectedIngredients.find(item => item.name === ingredientData.name);

    if (existingIngredient) {
        // Если ингредиент уже есть, увеличиваем количество
        existingIngredient.quantity = parseInt(existingIngredient.quantity) + parseInt(ingredientData.quantity);
    } else {
        // Если ингредиента нет, добавляем новый
        selectedIngredients.push(ingredientData);
    }

    renderOrder();  // Обновляем содержимое чашки и интерфейс
});

// Слушатель события touchstart для мобильных устройств
ingredientText.addEventListener('touchstart', (event) => {
    // Остановим стандартное поведение (например, предотвращаем прокрутку страницы)
    event.preventDefault();

    const ingredientName = ingredientText.textContent.split(' - ')[0];  // Имя ингредиента, например "Кофе"
    const quantity = parseInt(ingredientText.textContent.split(' - ')[1]);  // Количество, например "50 мл"  // Количество, например "50 мл"

    // Переводим имя ингредиента на русский
    const translatedName = translateIngredient(ingredientName);

    // Создаем новый элемент для отображения перетаскиваемого ингредиента
    const dragElement = document.createElement('div');
    dragElement.textContent = `${translatedName} - ${quantity}`;  // Переводим имя ингредиента
    dragElement.style.position = 'absolute';
    dragElement.style.zIndex = '9999';
    dragElement.style.background = '#ffe4b5';  // Цвет фона для перетаскиваемого элемента
    dragElement.style.padding = '5px';
    dragElement.style.borderRadius = '5px';
    dragElement.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    document.body.appendChild(dragElement);  // Добавляем этот элемент в DOM

    // Получаем позицию элемента на странице
    const startX = event.touches[0].pageX;
    const startY = event.touches[0].pageY;

    // Задаем начальные стили для перетаскиваемого элемента
    dragElement.style.left = `${startX - dragElement.offsetWidth / 2}px`;
    dragElement.style.top = `${startY - dragElement.offsetHeight / 2}px`;

    // Сохраняем данные ингредиента
    const ingredientData = {
        name: translatedName,
        quantity: quantity
    };

    // Обработчик для движения пальца
    const moveHandler = (moveEvent) => {
        const touchMove = moveEvent.touches[0];
        // Обновляем позицию перетаскиваемого элемента относительно родительского контейнера
        dragElement.style.left = `${touchMove.pageX - dragElement.offsetWidth / 2}px`;
        dragElement.style.top = `${touchMove.pageY - dragElement.offsetHeight / 2}px`;
    };

    // Обработчик для завершения перетаскивания
    const endHandler = (endEvent) => {
        // Убираем перетаскиваемый элемент с экрана
        dragElement.remove();

        // Получаем координаты чашки
        const cupRect = cup.getBoundingClientRect();

        // Проверяем, если перетаскиваемый элемент был отпущен внутри чашки
        const touchEnd = endEvent.changedTouches[0];
        if (
            touchEnd.pageX >= cupRect.left &&
            touchEnd.pageX <= cupRect.right &&
            touchEnd.pageY >= cupRect.top &&
            touchEnd.pageY <= cupRect.bottom
        ) {
            // Если внутри чашки, добавляем ингредиент
            const existingIngredient = selectedIngredients.find(item => item.name === ingredientData.name);

            if (existingIngredient) {
                // Если ингредиент уже есть, увеличиваем количество
                existingIngredient.quantity = parseInt(existingIngredient.quantity) + parseInt(ingredientData.quantity);
            } else {
                // Если ингредиента нет, добавляем новый
                selectedIngredients.push(ingredientData);
            }

            renderOrder();  // Обновляем содержимое чашки и интерфейс
        }
    };

    // Привязываем обработчики для перемещения и окончания перетаскивания
    document.addEventListener('touchmove', moveHandler);
    document.addEventListener('touchend', endHandler, { once: true });
});
