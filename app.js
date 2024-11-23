// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClSfhUgX2MfL4wd4x0aCT7G3tAyuzJlcQ",
    authDomain: "fa-ain-chatbot.firebaseapp.com",
    projectId: "fa-ain-chatbot",
    storageBucket: "fa-ain-chatbot.firebasestorage.app",
    messagingSenderId: "97241230590",
    appId: "1:97241230590:web:82df89b16d0248cfcd89af",
    measurementId: "G-ZJM5P3CYY1",
};

// Initialize Firebase
console.log("Initializing Firebase...");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Select elements from the HTML file
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Log UI elements to confirm proper selection
console.log("Chatbox:", chatbox ? "Found" : "Not Found");
console.log("UserInput:", userInput ? "Found" : "Not Found");
console.log("SendButton:", sendButton ? "Found" : "Not Found");

// Function to display a message in the chatbox
function displayMessage(sender, message) {
    console.log(`Attempting to display message: Sender: ${sender}, Message: ${message}`);
    try {
        const messageElement = document.createElement('p');
        messageElement.innerHTML = `<b>${sender}:</b> ${message}`;
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
        console.log(`Displayed message successfully: ${sender} - ${message}`);
    } catch (error) {
        console.error("Error displaying message:", error);
    }
}

// Event listener for the send button
sendButton.addEventListener('click', async () => {
    console.log("Send button clicked.");
    const userMessage = userInput.value.trim();
    console.log("User message captured:", userMessage);

    if (userMessage) {
        // Display user message in the chatbox
        displayMessage('You', userMessage);

        // Clear the input field
        userInput.value = '';

        // Simulate a bot response for debugging
        console.log("Generating bot response...");
        try {
            const botResponse = `Echo: ${userMessage}`;
            displayMessage('FA Ain', botResponse);
        } catch (error) {
            console.error("Error generating bot response:", error);
            displayMessage('Bot', 'Sorry, an error occurred while processing your request.');
        }
    } else {
        console.log("No message entered. Ignoring click.");
    }
});

// Enable "Enter" key to send messages
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        console.log("Enter key pressed.");
        sendButton.click();
    }
});
