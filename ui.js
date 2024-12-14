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

