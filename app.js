// Select the elements from the HTML file
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Authorization token for Grok API
const apiKey = 'xai-ZFV2ONv0AfOlJDgd6LykCwbZX22YgwJE5i324dJ8dm0O8geH1m9Z2F13pXbOuRTy8kHtZoUnttJvqS3M'; // Replace with your Grok API key

// Secret code for developer interaction
const developerCode = 'Faisal3ez';

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to display a message in the chatbox
function displayMessage(sender, message) {
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<b>${sender}:</b> ${message}`;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Function to save a message to Firestore (long memory)
async function saveMessageToFirestore(role, content) {
    try {
        await addDoc(collection(db, "messages"), {
            role: role,
            content: content,
            timestamp: new Date(),
        });
        console.log(`Message saved: ${role} - ${content}`);
    } catch (error) {
        console.error("Error saving message to Firestore:", error);
    }
}

// Function to process user input and get a response from the API
async function analyzeResponse(userMessage) {
    try {
        // Add user message to short-term memory
        if (!memory.chatHistory) memory.chatHistory = [];
        memory.chatHistory.push({ role: 'user', content: userMessage });

        // Save user message to Firestore
        await saveMessageToFirestore('user', userMessage);

        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: 'You are FA Ain, a helpful assistant.' },
                    ...memory.chatHistory,
                ],
                model: 'grok-beta',
                stream: false,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const botMessage = data.choices[0].message.content.trim();

        // Add bot message to short-term memory
        memory.chatHistory.push({ role: 'bot', content: botMessage });

        // Save bot message to Firestore
        await saveMessageToFirestore('bot', botMessage);

        return botMessage;
    } catch (error) {
        console.error("Error communicating with the API:", error);
        return 'Sorry, an error occurred while processing your request. Please try again later.';
    }
}

// Event listener for the Send button
sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        displayMessage('You', userMessage);
        userInput.value = '';

        // Process user input and get bot response
        try {
            const botResponse = await analyzeResponse(userMessage);
            displayMessage("FA Ain", botResponse);
        } catch (error) {
            console.error("Error processing user input:", error);
            displayMessage("FA Ain", "Sorry, an error occurred while processing your request.");
        }
    }
});

// Enable "Enter" key to send messages
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});
