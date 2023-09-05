// Function to send a message to GitHub Gists
async function sendMessage() {
    const messageText = document.getElementById('message').value;
    if (messageText.trim() !== '') {
        try {
            // Create a new message object
            const message = { text: messageText };

            // Fetch the existing Gist content
            const gistIds = {
                '9fec2f7e61d309d91cb7f735e9f53556': MSGBRDGST,
                // Add more Gist IDs as needed
            };
            
            const GistID = gistIds[MSGBRDGST];
            const response = await fetch(`https://api.github.com/gists/${gistId}`);
            const data = await response.json();

            // Update the Gist content with the new message
            data.files['message-board.json'].content = JSON.stringify([...JSON.parse(data.files['message-board.json'].content), message]);

            // Split and concatenate the PAT
            const part1 = 'ghp_'; // Prefix
            const part2 = 'dVBeJ57d0OfJ21bvA342'; // First part of the PAT
            const part3 = 'AeYiVb2nzh1ITeAf'; // Second part of the PAT
            const personalAccessToken = part1 + part2 + part3;

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
                    'Authorization': 'Bearer ' + personalAccessToken,
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
        const gistIds = {
            '9fec2f7e61d309d91cb7f735e9f53556': MSGBRDGST,
            // Add more Gist IDs as needed
        };
        
        const gistID = gistIds[MSGBRDGST];
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