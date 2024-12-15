// drag-and-drop.js

// Слушатель события dragstart для #drag-ingredient
ingredientText.addEventListener('dragstart', (event) => {
    const ingredientData = {
        name: ingredientText.textContent.split(' - ')[0],  // Имя ингредиента, например "Кофе"
        quantity: ingredientText.textContent.split(' - ')[1],  // Количество, например "50 мл"
    };

    // Сохраняем данные о ингредиенте в dataTransfer
    event.dataTransfer.setData('text/plain', JSON.stringify(ingredientData));
});

// Слушатель события drop для чашки
cup.addEventListener('dragover', (event) => {
    event.preventDefault();  // Разрешаем сброс
});

cup.addEventListener('drop', (event) => {
    event.preventDefault();

    // Извлекаем данные из dataTransfer
    const ingredientData = JSON.parse(event.dataTransfer.getData('text/plain'));

    // Создаем элемент и добавляем его в чашку
    const ingredientDiv = document.createElement('div');
    ingredientDiv.textContent = `${ingredientData.name} - ${ingredientData.quantity}`;  // Показываем имя и количество
    cup.appendChild(ingredientDiv);

    // Добавляем в массив для отслеживания выбранных ингредиентов
    selectedIngredients.push(ingredientData);

    renderOrder();  // Обновляем содержимое чашки и интерфейс
});

// Слушатель события touchstart для мобильных устройств
ingredientText.addEventListener('touchstart', (event) => {
    // Остановим стандартное поведение (например, предотвращаем прокрутку страницы)
    event.preventDefault();

    // Получаем данные о выбранном ингредиенте
    const ingredientData = {
        name: ingredientText.textContent.split(' - ')[0],  // Имя ингредиента, например "Кофе"
        quantity: ingredientText.textContent.split(' - ')[1],  // Количество, например "50 мл"
    };

    // Создаем новый элемент для отображения перетаскиваемого ингредиента
    const dragElement = document.createElement('div');
    dragElement.textContent = `${ingredientData.name} - ${ingredientData.quantity}`;
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
            const ingredientDiv = document.createElement('div');
            ingredientDiv.textContent = `${ingredientData.name} - ${ingredientData.quantity}`;
            cup.appendChild(ingredientDiv);

            // Добавляем в массив выбранных ингредиентов
            selectedIngredients.push(ingredientData);
            renderOrder();  // Обновляем содержимое чашки
        }

        // Убираем обработчики событий для движения и завершения
        document.removeEventListener('touchmove', moveHandler);
        document.removeEventListener('touchend', endHandler);
    };

    // Добавляем слушатели для перемещения пальца и окончания перетаскивания
    document.addEventListener('touchmove', moveHandler);
    document.addEventListener('touchend', endHandler);
});

