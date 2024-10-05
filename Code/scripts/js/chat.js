document.getElementById("chat-button").addEventListener("click", function() {
    var chatContainer = document.getElementById("chat-container");
    if (chatContainer.style.display === "none" || chatContainer.style.display === "") {
        chatContainer.style.display = "block";
    } else {
        chatContainer.style.display = "none";
    }
});

var chatInput = document.getElementById("chat-input");
var chatPrev = document.getElementById("chat-prev");

chatInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission

        var userInput = chatInput.value.trim(); // Get the user input and trim whitespace

        if (userInput !== "") {
            // Create a new user message element
            var userMessage = document.createElement("div");
            userMessage.classList.add("message", "user-message");
            userMessage.innerText = userInput;

            // Append user message to the chat
            chatPrev.appendChild(userMessage);

            // Clear the input field
            chatInput.value = "";

            // Simulate a response from the system or bot (you can replace this with an actual system response)
            setTimeout(function() {
                var systemMessage = document.createElement("div");
                systemMessage.classList.add("message", "system-message");
                systemMessage.innerText = "This is a simulated response to: " + userInput;

                // Append system message to the chat
                chatPrev.appendChild(systemMessage);

                // Scroll to the bottom of the chat container
                chatPrev.scrollTop = chatPrev.scrollHeight;
            }, 1000); // Simulate delay for system response
        }
    }
});

console.log("Chat system with discussion implemented.");
