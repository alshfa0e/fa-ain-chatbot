// Select the elements from the HTML file
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Authorization token for Grok API
const apiKey = 'xai-ZFV2ONv0AfOlJDgd6LykCwbZX22YgwJE5i324dJ8dm0O8geH1m9Z2F13pXbOuRTy8kHtZoUnttJvqS3M'; // Replace with your Grok API key

// Secret code for developer interaction
const developerCode = 'Faisal3ez';

// Full Prompt with 9 Sections
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

// Function to detect the user's language
function detectLanguage(input) {
    const arabicRegex = /[\u0600-\u06FF]/; // Regex to detect Arabic characters
    return arabicRegex.test(input) ? 'arabic' : 'english';
}

// Function to dynamically set the bot's name
function getBotName(language) {
    return language === 'arabic' ? "فاء عين" : "FA";
}

// Function to display a message in the chatbox
function displayMessage(sender, message) {
    const formattedMessage = message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold formatting
        .replace(/###(.*?\.)/g, '<strong>$1</strong>') // Bold from ### to period
        .replace(/\n/g, '<br>'); // Line breaks

    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<b>${sender}:</b> ${formattedMessage}`;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to the bottom
}

// Function to handle user input and fetch a response
async function analyzeResponse(userMessage) {
    const userLanguage = detectLanguage(userMessage); // Detect language
    const botName = getBotName(userLanguage); // Get bot name based on language
    displayMessage('You', userMessage); // Display user message
    showLoadingIndicator();

    try {
        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage },
                ],
                model: 'grok-beta', // Replace with your chosen model
                stream: false,
                temperature: 0.7,
            }),
        });

        if (!response.ok) throw new Error(`API error: ${response.status} ${response.statusText}`);
        const data = await response.json();
        removeLoadingIndicator();
        displayMessage(botName, data.choices[0].message.content.trim());
    } catch (error) {
        removeLoadingIndicator();
        displayMessage(botName, userLanguage === 'arabic'
            ? 'عذرًا، حدث خطأ أثناء معالجة طلبك. حاول مرة أخرى لاحقًا.'
            : 'Sorry, an error occurred while processing your request. Please try again later.');
    }
}

// Show loading indicator
function showLoadingIndicator() {
    const loadingElement = document.createElement('p');
    loadingElement.id = 'loading-indicator';
    loadingElement.innerHTML = `<b>Processing...</b>`;
    chatbox.appendChild(loadingElement);
    chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to the bottom
}

// Remove loading indicator
function removeLoadingIndicator() {
    const loadingElement = document.getElementById('loading-indicator');
    if (loadingElement) {
        chatbox.removeChild(loadingElement);
    }
}

// Add event listener for send button
sendButton.addEventListener('click', () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        analyzeResponse(userMessage);
        userInput.value = ''; // Clear input box
    }
});

// Add "Enter" key functionality
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') sendButton.click();
});
