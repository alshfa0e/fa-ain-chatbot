// Select the elements from the HTML file
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Authorization token for Grok API
const apiKey = 'xai-ZFV2ONv0AfOlJDgd6LykCwbZX22YgwJE5i324dJ8dm0O8geH1m9Z2F13pXbOuRTy8kHtZoUnttJvqS3M'; // Replace with your Grok API key

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

// Memory object for short-term session memory
let memory = [];

// Function to display a message in the chatbox
function displayMessage(sender, message) {
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<b>${sender}:</b> ${message}`;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Function to save a message to Firestore
async function saveMessageToDatabase(role, content) {
    try {
        const messageRef = collection(db, "messages"); // Ensure "messages" is a valid collection in Firestore
        await addDoc(messageRef, {
            role: role,
            content: content,
            timestamp: new Date().toISOString(),
        });
        console.log(`Message saved: ${role} - ${content}`);
    } catch (error) {
        console.error("Error saving message to Firestore:", error);
    }
}

// Function to handle API response
async function analyzeResponse(userMessage) {
    try {
        // Add user message to short-term memory
        memory.push({ role: 'user', content: userMessage });

        // Save user message to Firestore
        await saveMessageToDatabase('user', userMessage);

        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: "You are FA Ain, a helpful assistant." },
                    ...memory,
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
        memory.push({ role: 'bot', content: botMessage });

        // Save bot message to Firestore
        await saveMessageToDatabase('bot', botMessage);

        return botMessage;
    } catch (error) {
        console.error("Error communicating with the API:", error);
        return 'Sorry, an error occurred while processing your request.';
    }
}

// Event listener for the Send button
sendButton.addEventListener('click', () => {
    const userMessage = userInput.value.trim();
    console.log("Captured user message:", userMessage); // Log the captured message
    if (!userMessage) {
        console.error("No message entered!");
    }
});

// Enable "Enter" key to send messages
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});
