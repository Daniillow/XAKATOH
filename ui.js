// ui.js

function showNotification(message) {
    const notificationElement = document.getElementById("notification");
    const notificationText = document.getElementById("notification-text");
    notificationText.textContent = message;
    notificationElement.style.display = "block";
}

function closeNotification() {
    const notificationElement = document.getElementById("notification");
    notificationElement.style.display = "none";
}

function renderOrder() {
    const orderDiv = document.getElementById("order");
    if (!game.currentOrder) {
        orderDiv.innerHTML = "<p>Выберите клиента для выполнения заказа.</p>";
        return;
    }
    const recipe = game.recipes[game.currentOrder.order];
    orderDiv.innerHTML = 
        `<h3>Заказ: ${game.currentOrder.order}</h3>
        <ul>
            ${Object.entries(recipe).map(([ingredient, amount]) => `<li>${ingredient}: ${amount} мл</li>`).join("")}
        </ul>`;
}
