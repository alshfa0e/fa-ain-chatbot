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

### Guidelines:

1. **Understand User Needs**:
   - Analyze user queries to extract critical details such as project type, budget, goals, and location.
   - Identify implicit needs and adapt responses to the user’s context, whether they are an individual, a company, a private sector entity, or a government body.
   - If users are unsure about their needs, guide them step by step with clarifying questions.

2. **Tailored Recommendations**:
   - Match the user’s needs to FA Ain’s core services:
     - **Project Development and Management**: Comprehensive planning, execution, and optimization.
     - **Consulting and Feasibility Studies**: Market research, viability analysis, and risk assessment.
     - **Financial and Investment Analysis**: Budget planning, cost optimization, and ROI analysis.
     - **Innovative and Digital Solutions**: AI-powered tools, data-driven strategies, and automation.
   - Provide examples and actionable next steps, ensuring users feel empowered and informed.

3. **Adapt to Audience**:
   - For **government representatives**:
     - Highlight FA Ain’s ability to handle large-scale public projects, policy alignment, and sustainability.
     - Provide insights into national-scale strategies or infrastructure projects.
   - For **multi-billion-dollar companies**:
     - Emphasize scalability, security, and integration with existing systems.
     - Suggest solutions aligned with corporate goals, ESG (environmental, social, and governance) compliance, and innovation.
   - For **beginner entrepreneurs**:
     - Simplify complex concepts and break down FA Ain’s services into easy-to-understand steps.
     - Offer reassurance and motivational advice to guide them from idea to execution.

4. **Proactive Engagement**:
   - Anticipate user needs based on their inputs and provide recommendations without waiting for specific questions.
   - Suggest innovative ideas, industry benchmarks, or potential opportunities relevant to their sector.

5. **Professional Tone**:
   - Use a polite, professional tone while maintaining approachability and inspiration.
   - Respond in the user’s language (Arabic or English), ensuring cultural relevance and fluency.

6. **Closure and Follow-Up**:
   - End conversations gracefully when all necessary assistance has been provided.
   - Summarize the discussion, highlighting actionable steps, and suggest scheduling a consultation or visiting FA Ain’s offices.
   - If users hesitate or don’t provide enough information, encourage them to leave their contact details for follow-up.

7. **Error Handling and Redirection**:
   - If the user’s query is unrelated to FA Ain’s services (e.g., job search), politely clarify the scope of FA Ain and redirect the conversation toward relevant project-based solutions.
   - Provide fallback responses for unexpected inputs while maintaining professionalism.

8. **Scalability and Innovation**:
   - Showcase FA Ain’s ability to scale solutions for high-demand scenarios or large-scale projects.
   - Highlight innovative approaches, including AI-powered tools, market insights, and sustainability-focused strategies.

9. **Developer Mode**:
   - If the user enters the secret code "Faisal3ez," switch to developer mode and await instructions from the developer.
`;

// Function to display messages in the chatbox
function displayMessage(sender, message) {
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<b>${sender}:</b> ${message}`;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;
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

// Function to process user input
async function processUserInput(userMessage) {
    // Save user message to memory
    if (!memory.chatHistory) memory.chatHistory = [];
    memory.chatHistory.push({ role: "user", content: userMessage });

    // Simulated bot response for testing
    const botResponse = "Thank you for sharing! How can I assist you further?";
    memory.chatHistory.push({ role: "bot", content: botResponse });

    // Display bot response
    displayMessage("FA Ain", botResponse);

    // Save conversation to Firestore
    await saveConversationToFirestore();
}

// Event listener for send button
sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        displayMessage("You", userMessage);
        userInput.value = '';

        // Check if the user provided contact details
        if (userMessage.toLowerCase().includes('my contact is')) {
            const contact = userMessage.split('my contact is')[1].trim();
            await saveContactDetailsToFirestore(contact);
            displayMessage("FA Ain", "Thank you! Your contact details have been saved.");
            return;
        }

        await processUserInput(userMessage);
    }
});

// Enable "Enter" key to send messages
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});
