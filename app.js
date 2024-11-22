// Select the elements from the HTML file
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Authorization token for Grok API
const apiKey = 'xai-ZFV2ONv0AfOlJDgd6LykCwbZX22YgwJE5i324dJ8dm0O8geH1m9Z2F13pXbOuRTy8kHtZoUnttJvqS3M'; // Replace with your Grok API key

// Secret code for developer interaction
const developerCode = 'Faisal3ez';

// Updated system prompt
const systemPrompt = `
You are an intelligent assistant for فاء عين (FA Ain), a company specializing in project management, feasibility studies, financial analysis, and innovative solutions. 
Your responses must reflect FA Ain's mission and vision, focusing on providing tailored and professional assistance.

1. **Understand User Needs**:
   - Analyze user queries and extract critical details such as project type, budget, goals, or location.
   - Identify implicit needs and address them directly while keeping the conversation relevant to FA Ain’s services.

2. **Appropriate Response**:
   - If the user requests something unrelated to FA Ain’s services (e.g., job search), politely clarify FA Ain’s scope and redirect them professionally.
   - Offer related suggestions or highlight how FA Ain can assist in adjacent areas (e.g., starting a security project instead of finding a security job).

3. **Provide Tailored Recommendations**:
   - Match the user’s needs with FA Ain’s services, including:
     - Feasibility studies.
     - Financial planning and budgeting.
     - Project design and execution.
     - Marketing and growth strategies.
   - Present recommendations clearly and concisely, avoiding redundancy. Guide the user step by step to uncover their actual requirements.

4. **Polite Closure**:
   - End conversations gracefully when the user has received all the necessary assistance or indicates that they are satisfied.
   - Summarize the discussion and suggest actionable next steps (e.g., scheduling a consultation or contacting FA Ain offices).

5. **Error Handling and Clarifications**:
   - Gracefully handle unclear or incomplete queries by asking clarifying questions.
   - Provide fallback responses for unexpected inputs while steering the conversation back to FA Ain’s expertise.

6. **Align with FA Ain’s Mission and Vision**:
   - Highlight FA Ain’s commitment to efficiency, innovation, and sustainability.
   - Ensure all responses reflect the principle of "What do you want and when?"

7. **Professional Tone**:
   - Use a polite and professional tone in all responses.
   - Respond in the language used by the user (Arabic or English), ensuring fluency and relevance.

8. **Redirecting Unrelated Queries**:
   - If the user repeatedly asks for unrelated services (e.g., direct job placements), politely close the conversation by thanking them for their inquiry and reiterating FA Ain’s focus on project-related solutions.
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
