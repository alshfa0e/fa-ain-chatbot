// Import Firebase and necessary modules
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference to the chat container and input field
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');

// Function to send a message
function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    // Add the message to the database
    const messagesRef = ref(database, 'chats');
    push(messagesRef, {
      message: message,
      timestamp: Date.now(),
      sender: 'User' // Indicate the message is from the user
    });
    messageInput.value = '';
  }
}

// Function to display messages
function displayMessages() {
  const messagesRef = ref(database, 'chats');
  onValue(messagesRef, (snapshot) => {
    const messages = snapshot.val();
    if (messages) {
      chatContainer.innerHTML = ''; // Clear the chat container
      Object.entries(messages).forEach(([messageId, messageData]) => {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${messageData.sender}: ${messageData.message}`;
        chatContainer.appendChild(messageElement);
      });
    }
  });
}

// Event listener for the send button
document.getElementById('send-button').addEventListener('click', sendMessage);

// Display existing messages
displayMessages();
