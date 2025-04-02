document.addEventListener("DOMContentLoaded", function () {
    const chatbotContainer = document.getElementById("chatbot-container");
    const chatbotIcon = document.getElementById("chatbot-icon");
    const closeButton = document.getElementById("close-btn");
    const sendBtn = document.getElementById("send-btn");
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotMessages = document.getElementById("chatbotmessages"); // Fixed ID

    const GEMINI_API_KEY = "AIzaSyBBDnhujPELFHRnbwU3gx6-PzK0__pz4-w"; // Replace with your actual Gemini API key
    const apiUrl =`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`;

    // Show chatbot when clicking the icon
    chatbotIcon.addEventListener("click", function () {
        chatbotContainer.classList.remove("hidden");
        chatbotIcon.style.display = "none";
    
    //check if welcome message is already present to avoid duplicates
    if (!document.querySelector(".welcome-message")){
        appendMessage("bot",'Hey! Welcome to your smart AI companion. How can i assist you today?',"welcome-message");
    }
});

    // Hide chatbot when clicking the close button
    closeButton.addEventListener("click", function () {
        chatbotContainer.classList.add("hidden");
        chatbotIcon.style.display = "flex";

         // Clear chat history when closing the chatbot
         clearChatHistory();
    });

    // Send message on button click or Enter key press
    sendBtn.addEventListener("click", sendMessage);
    chatbotInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        const userMessage = chatbotInput.value.trim();
        if (userMessage) {
            appendMessage("user", userMessage);
            chatbotInput.value = "";
            getBotResponse(userMessage);
        }
    }

    function appendMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender);
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function getBotResponse(userMessage) {
        try{
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: userMessage }] }] })
            });

            const data = await response.json();
            if (data.candidates && data.candidates.length > 0) {
                const botMessage = data.candidates[0].content.parts[0].text;
                appendMessage("bot", botMessage);
            } else {
                appendMessage("bot", "I couldn't understand that. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching bot response:", error);
            appendMessage("bot", "Sorry, something went wrong. Please try again.");
        }
    }

     // Clear chat history
     function clearChatHistory() {
        chatbotMessages.innerHTML = ''; // Clears all messages in the chat container
    }
});
