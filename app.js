// Import Firebase and necessary modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClSfhUgX2MfL4wd4x0aCT7G3tAyuzJlcQ",
  authDomain: "fa-ain-chatbot.firebaseapp.com",
  projectId: "fa-ain-chatbot",
  storageBucket: "fa-ain-chatbot.firebasestorage.app",
  messagingSenderId: "97241230590",
  appId: "1:97241230590:web:82df89b16d0248cfcd89af",
  measurementId: "G-ZJM5P3CYY1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference to the chat container and input field
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');



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

// Function to send a message
function sendMessage() {
  const userMessage = messageInput.value.trim();
  if (userMessage) {
    // Add the user message to the database
    const messagesRef = ref(database, 'chats');
    push(messagesRef, {
      message: userMessage,
      timestamp: Date.now(),
      sender: 'User',
    });

    // Simulate bot response
    const botResponse = getBotResponse(userMessage);
    push(messagesRef, {
      message: botResponse,
      timestamp: Date.now(),
      sender: 'FA Ain',
    });

    messageInput.value = ''; // Clear input field
  }
}

// Function to simulate the bot's response
function getBotResponse(userMessage) {
  if (userMessage.toLowerCase().includes('project')) {
    return "FA Ain: It seems like you have a project. Could you share more details such as the type of project, budget, and goals?";
  } else if (userMessage.toLowerCase().includes('contact')) {
    return "FA Ain: Sure! Please share your contact details, and we will get back to you.";
  } else {
    return "FA Ain: Thank you for reaching out. Could you elaborate more on your query?";
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
        messageElement.className = messageData.sender === 'User' ? 'user-message' : 'bot-message'; // Add CSS class
        chatContainer.appendChild(messageElement);
      });
      chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll to the bottom
    }
  });
}

// Event listener for the send button
document.getElementById('send-button').addEventListener('click', sendMessage);

// Display existing messages
displayMessages();
