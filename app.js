// Select the elements from the HTML file
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Authorization token for Grok API
const apiKey = 'xai-ZFV2ONv0AfOlJDgd6LykCwbZX22YgwJE5i324dJ8dm0O8geH1m9Z2F13pXbOuRTy8kHtZoUnttJvqS3M'; // Replace with your Grok API key

// Secret code for developer interaction
const developerCode = 'Faisal3ez';

// System prompt for the bot, incorporating FA Ain’s core services and tailored recommendations
const systemPrompt = `
You are an intelligent assistant for فاء عين (FA Ain), a company specializing in project development, feasibility studies, financial analysis, and innovative solutions. 
Your role is to help users understand and explore the company's core services while tailoring responses to their specific sector: individuals, companies, private sectors, or governments.

Core services provided by FA Ain:
1. **Project Development and Management**: Comprehensive planning, execution, and monitoring of projects.
2. **Consulting and Feasibility Studies**: Detailed market research and feasibility assessments.
3. **Financial and Investment Analysis**: Budget planning, cost optimization, and ROI analysis.
4. **Innovative and Digital Solutions**: AI-powered tools and digital strategies.

### Guidelines:
1. **Identify User Needs**:
   - Ask about the user's sector (individual, company, private sector, or government).
   - Guide them to relevant core services.

2. **Explain Services Clearly**:
   - Provide concise, easy-to-understand descriptions of the services.
   - Tailor examples and recommendations based on the user's sector.

3. **Encourage Interaction**:
   - Offer to provide additional details, examples, or case studies for each service.
   - Prompt users to specify their needs or projects to receive tailored advice.

4. **Polite Closure**:
   - Conclude the conversation by summarizing the services discussed.
   - Suggest visiting FA Ain’s offices or leaving contact details for follow-up.

5. **Developer Mode**:
   - If the user inputs the secret code "Faisal3ez," enter developer mode and await further instructions.
`;

// Function to determine bot name based on response language
function getBotName(response) {
    const arabicRegex = /[\u0600-\u06FF]/; // Checks for Arabic characters
    return arabicRegex.test(response) ? "فاء عين" : "FA Ain";
}

// Function to determine message alignment based on language
function getMessageAlignment(response) {
    const arabicRegex = /[\u0600-\u06FF]/; // Checks for Arabic characters
    return arabicRegex.test(response) ? 'left' : 'right'; // Arabic messages align left, others align right
}

// Function to display a message in the chatbox with formatting
function displayMessage(sender, message) {
    // Process **words** and ### bold formatting
    let formattedMessage = message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold for **words**
        .replace(/###(.*?\.)/g, '<strong>$1</strong>'); // Bold for ### until a period

    formattedMessage = formattedMessage.replace(/\n/g, '<br>'); // Add line breaks

    // Determine alignment dynamically
    const alignment = getMessageAlignment(message);

    // Display the formatted message
    const messageElement = document.createElement('p');
    messageElement.style.textAlign = alignment; // Set alignment dynamically
    messageElement.innerHTML = `<b>${sender}:</b> ${formattedMessage}`;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to the bottom
}

// Function to show a loading spinner
function showLoadingIndicator() {
    const loadingElement = document.createElement('p');
    loadingElement.id = 'loading-indicator';
    loadingElement.style.textAlign = 'right'; // Default alignment for loading
    loadingElement.innerHTML = `<b>FA Ain:</b> <em>Processing your request...</em>`;
    chatbox.appendChild(loadingElement);
    chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll to the bottom
}

// Function to remove the loading spinner
function removeLoadingIndicator() {
    const loadingElement = document.getElementById('loading-indicator');
    if (loadingElement) {
        chatbox.removeChild(loadingElement);
    }
}

// Function to process user input and get a response from the API
async function analyzeResponse(userMessage) {
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
                model: 'grok-beta',
                stream: false,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Return the processed response
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error communicating with the API:', error);
        return 'عذرًا، حدث خطأ أثناء معالجة طلبك. حاول مرة أخرى لاحقًا.';
    }
}

// Event listener for the send button
sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        displayMessage('You', userMessage); // Display the user's message
        userInput.value = ''; // Clear the input box

        // Check for developer code
        if (userMessage.includes(developerCode)) {
            displayMessage("Developer Mode", "Developer input detected. Awaiting your advice.");
            return;
        }

        // Show the loading indicator
        showLoadingIndicator();

        try {
            const botResponse = await analyzeResponse(userMessage);

            // Remove the loading indicator
            removeLoadingIndicator();

            const botName = getBotName(botResponse); // Determine bot name dynamically
            displayMessage(botName, botResponse);
        } catch (error) {
            console.error('Error processing user input:', error);

            // Remove the loading indicator
            removeLoadingIndicator();

            displayMessage('Bot', 'Sorry, an error occurred while processing your request. Please try again later.');
        }
    }
});

// Enable "Enter" key to send messages
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendButton.click();
    }
});
