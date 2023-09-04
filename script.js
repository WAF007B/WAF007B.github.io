// Function to send a message to GitHub Gists
async function sendMessage() {
    const messageText = document.getElementById('message').value;
    if (messageText.trim() !== '') {
        try {
            // Create a new message object
            const message = { text: messageText };

            // Fetch the existing Gist content
            const gistIds = {
                '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': 'Message Board Gist',
                // Add more Gist IDs as needed
            };
            
            const selectedGistId = gistIds['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'];

            const response = await fetch(`https://api.github.com/gists/${gistId}`);
            const data = await response.json();

            // Update the Gist content with the new message
            data.files['message-board.json'].content = JSON.stringify([...JSON.parse(data.files['message-board.json'].content), message]);

            // Send a PATCH request to update the Gist
            const updateResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    files: {
                        'message-board.json': {
                            content: data.files['message-board.json'].content,
                        },
                    },
                }),
                headers: {
                    'Authorization': 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, // Replace with your GitHub Personal Access Token
                },
            });

            if (updateResponse.status === 200) {
                // Clear the input field
                document.getElementById('message').value = '';
                // Reload messages
                displayMessages();
            } else {
                console.error('Failed to update Gist:', updateResponse.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

// Function to display messages (fetch from GitHub Gists)
async function displayMessages() {
    try {
        // Fetch the Gist content
        const gistId = 'YOUR_GIST_ID'; // Replace with your Gist ID
        const response = await fetch(`https://api.github.com/gists/${gistId}`);
        const data = await response.json();

        // Parse the content and display messages
        const messages = JSON.parse(data.files['message-board.json'].content);
        const messageList = document.getElementById('messageList');
        messageList.innerHTML = '';

        messages.forEach((message) => {
            const li = document.createElement('li');
            li.innerText = message.text;
            messageList.appendChild(li);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call displayMessages() to load and display existing messages when the page loads.
displayMessages();
