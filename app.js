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
console.log("Chatbox:", chatbox);
console.log("UserInput:", userInput);
console.log("SendButton:", sendButton);

// Authorization token for Grok API
const apiKey = 'xai-ZFV2ONv0AfOlJDgd6LykCwbZX22YgwJE5i324dJ8dm0O8geH1m9Z2F13pXbOuRTy8kHtZoUnttJvqS3M';

// Secret code for developer interaction
const developerCode = 'Faisal3ez';

// Memory object for short-term session memory
let memory = {};

// System prompt for the bot
const systemPrompt = `
You are the virtual assistant for فاء عين (FA Ain), a company specializing in project management, feasibility studies, financial analysis, and innovative solutions. Your mission is to provide professional, tailored, and actionable assistance to users while embodying FA Ain’s core values of efficiency, innovation, and sustainability.
`;

// Function to determine bot name based on response language
function getBotName(response) {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(response) ? "فاء عين" : "FA Ain";
}

// Function to display a message in the chatbox
function displayMessage(sender, message) {
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<b>${sender}:</b> ${message}`;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;
    console.log(`Displayed message: ${sender} - ${message}`);
}

// Function to save a conversation session to Firestore
async function saveConversationToDatabase() {
    try {
        if (memory.chatHistory && memory.chatHistory.length > 0) {
            await addDoc(collection(db, "sessions"), {
                timestamp: new Date(),
                chatHistory: memory.chatHistory,
            });
            console.log("Session saved to Firestore!");
        }
    } catch (error) {
        console.error("Error saving session: ", error);
    }
}

// Function to process user input and get a simulated response
async function analyzeResponse(userMessage) {
    console.log("Analyzing response for message:", userMessage);
    try {
        if (!memory.chatHistory) memory.chatHistory = [];
        memory.chatHistory.push({ role: 'user', content: userMessage });

        // Simplified bot response for debugging
        const botMessage = `Echo: ${userMessage}`;
        memory.chatHistory.push({ role: 'bot', content: botMessage });

        await saveConversationToDatabase(); // Save conversation to Firestore
        return botMessage;
    } catch (error) {
        console.error('Error during response analysis:', error);
        return 'Sorry, an error occurred while processing your request.';
    }
}

// Event listener for the send button
sendButton.addEventListener('click', async () => {
    console.log("Send button clicked.");
    const userMessage = userInput.value.trim();
    if (userMessage) {
        console.log("User message captured:", userMessage);
        displayMessage('You', userMessage);
        userInput.value = '';

        // Developer mode
        if (userMessage.includes(developerCode)) {
            displayMessage("Developer Mode", JSON.stringify(memory, null, 2));
            return;
        }

        try {
            const botResponse = await analyzeResponse(userMessage);
            const botName = getBotName(botResponse);
            displayMessage(botName, botResponse);
        } catch (error) {
            console.error('Error processing user input:', error);
            displayMessage('Bot', 'Sorry, an error occurred while processing your request.');
        }
    } else {
        console.log("No message entered.");
    }
});

// Enable "Enter" key to send messages
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        console.log("Enter key pressed.");
        sendButton.click();
    }
});

// Load the previous session when the chatbot initializes
(async () => {
    try {
        console.log("Loading previous session...");
        const querySnapshot = await getDocs(collection(db, "sessions"));
        const sessions = [];
        querySnapshot.forEach((doc) => {
            sessions.push({ id: doc.id, ...doc.data() });
        });

        if (sessions.length > 0) {
            const lastSession = sessions[sessions.length - 1];
            memory.chatHistory = lastSession.chatHistory || [];
            memory.chatHistory.forEach((msg) => {
                displayMessage(msg.role === 'user' ? 'You' : 'Bot', msg.content);
            });
        } else {
            console.log("No previous sessions found.");
        }
    } catch (error) {
        console.error("Error loading previous session:", error);
    }
})();
