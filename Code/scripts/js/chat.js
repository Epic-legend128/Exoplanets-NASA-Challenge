document.getElementById("chat-button").addEventListener("click", function() {
    var chatContainer = document.getElementById("chat-container");
    if (chatContainer.style.display === "none" || chatContainer.style.display === "") {
        chatContainer.style.display = "block";
        document.getElementById("chat-input").focus();
    } else {
        chatContainer.style.display = "none";
    }
});

var chatContainer = document.getElementById("chat-container");
var chatPrev = document.getElementById("chat-prev");

chatContainer.addEventListener("submit", function(event) {
    
});