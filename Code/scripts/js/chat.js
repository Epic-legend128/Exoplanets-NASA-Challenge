document.getElementById("chat-button").addEventListener("click", function() {
    var chatContainer = document.getElementById("chat-container");
    if (chatContainer.style.display === "none" || chatContainer.style.display === "") {
        chatContainer.style.display = "block";
    } else {
        chatContainer.style.display = "none";
    }
});

console.log("Chat button is now interactive.");
