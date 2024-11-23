// Select the elements from the HTML file
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Authorization token for Grok API
const apiKey = 'xai-ZFV2ONv0AfOlJDgd6LykCwbZX22YgwJE5i324dJ8dm0O8geH1m9Z2F13pXbOuRTy8kHtZoUnttJvqS3M'; // Replace with your Grok API key

// Memory object for short-term session memory
let memory = {};

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Firebase configuration
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

// System prompt for the bot, incorporating FA Ain’s core services and tailored recommendations
const systemPrompt = `
You are the virtual assistant for فاء عين (FA Ain), a company specializing in project management, feasibility studies, financial analysis, and innovative solutions. Your mission is to provide professional, tailored, and actionable assistance to users while embodying FA Ain’s core values of efficiency, innovation, and sustainability. Adapt your responses to meet the needs of diverse users, including individuals, companies, private sectors, and governments.
`;

// Function to display messages in the chatbox
function displayMessage(sender, message) {
    console.log(`Displaying message from ${sender}:`, message);

    // Validate message content
    if (!message || typeof message !== 'string') {
        console.error("Invalid message content:", message);
        return;
    }

    // Create message element
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<b>${sender}:</b> ${message.replace(/\n/g, '<br>')}`;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to the bottom
}

// Function to save conversations to Firestore
async function saveConversationToFirestore() {
    try {
        if (memory.chatHistory && memory.chatHistory.length > 0) {
            await addDoc(collection(db, "conversations"), {
                chatHistory: memory.chatHistory,
                timestamp: new Date(),
            });
            console.log("Conversation saved to Firestore!");
        }
    } catch (error) {
        console.error("Error saving conversation to Firestore:", error);
    }
}

// Function to save user contact details to Firestore
async function saveContactDetailsToFirestore(contact) {
    try {
        await addDoc(collection(db, "contacts"), {
            contact: contact,
            timestamp: new Date(),
        });
        console.log("Contact details saved to Firestore!");
    } catch (error) {
        console.error("Error saving contact details to Firestore:", error);
    }
}

// Function to process user input and generate bot response
async function processUserInput(userMessage) {
    console.log("Processing user input:", userMessage);

    // Save user message to memory
    if (!memory.chatHistory) memory.chatHistory = [];
    memory.chatHistory.push({ role: "user", content: userMessage });

    // Simulated bot response (replace this with actual API response if needed)
    const botResponse = "Thank you for sharing! How can I assist you further?";
    console.log("Generated bot response:", botResponse);

    // Save bot response to memory
    memory.chatHistory.push({ role: "bot", content: botResponse });

    // Display bot response in the chatbox
    displayMessage("FA Ain", botResponse);

    // Save conversation to Firestore
    await saveConversationToFirestore();
}

// Event listener for the Send button
sendButton.addEventListener('click', async () => {
    console.log("Send button clicked");

    // Get user input
    const userMessage = userInput.value.trim();
    if (userMessage) {
        console.log("User message to process:", userMessage);

        // Display user message in the chatbox
        displayMessage("You", userMessage);

        // Clear input field
        userInput.value = '';

        // Check if the user provided contact details
        if (userMessage.toLowerCase().includes('my contact is')) {
            const contact = userMessage.split('my contact is')[1].trim();
            await saveContactDetailsToFirestore(contact);
            displayMessage("FA Ain", "Thank you! Your contact details have been saved.");
            return;
        }

        // Process user input and generate bot response
        await processUserInput(userMessage);
    }
});

// Enable "Enter" key to send messages
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        console.log("Enter key pressed");
        sendButton.click();
    }
});
