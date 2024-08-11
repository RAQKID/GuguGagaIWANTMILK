const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

// Retrieve your API key and valid user IDs from environment variables
const apiKey = process.env.KEY || '';  // Replace with your actual API key
const validUserIDs = process.env.RESPONSES.split(',');

app.use(express.json());

// Root route handler to return "Go to /chat"
app.get('/', (req, res) => {
    res.send('Go to /chat\n\n\n\nThanks for NodeJS, Typescript, JavaScript, HTML, CSS, Cloudfare, Vercel.app and Render.com');
});

// New route handler for /chat
app.get('/chat', (req, res) => {
    res.send('Go to /command_rplus if Command R+.\nGo to /Yi_Large if Yi Large.\nGo to /LLaMAv3 if LLaMA v3.\nGo to /Qwen if Qwen.\nGo to /GPTv4 if ChatGpt-V4.\nGo to /Blackbox if Blackbox.');
});

// Route to handle GET requests with 'prompt' and 'userID' query parameters
app.get('/chat/command_rplus', async (req, res) => {
    const { prompt, key } = req.query;

    if (!prompt || !key) {
        return res.status(400).json({ error: 'Both prompt and key are required' });
    }

    // Validate the provided userID
    if (!validUserIDs.includes(key)) {
        return res.status(403).json({ error: 'Invalid key' });
    }

    try {
        const apiUrl = `https://api.kastg.xyz/api/ai/command-r-plus?prompt=${encodeURIComponent(prompt)}&key=${apiKey}`;

        const response = await axios.get(apiUrl);

        // Send back the response from the external API
        res.json(response.data);
    } catch (error) {
        console.error('Error calling external API:', error.message);
        res.status(500).json({ error: 'Failed to retrieve response from the external API' });
    }
});

// --------------------------------------------------------------------------------------------


// Route to handle GET requests with 'prompt' and 'userID' query parameters
app.get('/chat/Yi_Large', async (req, res) => {
    const { prompt, key } = req.query;

    if (!prompt || !key) {
        return res.status(400).json({ error: 'Both prompt and key are required' });
    }

    // Validate the provided userID
    if (!validUserIDs.includes(key)) {
        return res.status(403).json({ error: 'Invalid key' });
    }

    try {
        const apiUrl = `https://api.kastg.xyz/api/ai/yi-large?prompt=${encodeURIComponent(prompt)}&key=${apiKey}`;

        const response = await axios.get(apiUrl);

        // Send back the response from the external API
        res.json(response.data);
    } catch (error) {
        console.error('Error calling external API:', error.message);
        res.status(500).json({ error: 'Failed to retrieve response from the external API' });
    }
});

// --------------------------------------------------------------------------------------------


// Route to handle GET requests with 'prompt' and 'userID' query parameters
app.get('/chat/LLaMAv3', async (req, res) => {
    const { prompt, key } = req.query;

    if (!prompt || !key) {
        return res.status(400).json({ error: 'Both prompt and key are required' });
    }

    // Validate the provided userID
    if (!validUserIDs.includes(key)) {
        return res.status(403).json({ error: 'Invalid key' });
    }

    try {
        const apiUrl = `https://api.kastg.xyz/api/ai/fast-llamaV3-large?prompt=${encodeURIComponent(prompt)}&key=${apiKey}`;

        const response = await axios.get(apiUrl);

        // Send back the response from the external API
        res.json(response.data);
    } catch (error) {
        console.error('Error calling external API:', error.message);
        res.status(500).json({ error: 'Failed to retrieve response from the external API' });
    }
});

// --------------------------------------------------------------------------------------------


// Route to handle GET requests with 'prompt' and 'userID' query parameters
app.get('/chat/GPTv4', async (req, res) => {
    const { prompt, key } = req.query;

    if (!prompt || !key) {
        return res.status(400).json({ error: 'Both prompt and key are required' });
    }

    // Validate the provided userID
    if (!validUserIDs.includes(key)) {
        return res.status(403).json({ error: 'Invalid key' });
    }

    try {
        const apiUrl = `https://api.kastg.xyz/api/ai/chatgpt?prompt=${encodeURIComponent(prompt)}&key=${apiKey}`;

        const response = await axios.get(apiUrl);

        // Send back the response from the external API
        res.json(response.data);
    } catch (error) {
        console.error('Error calling external API:', error.message);
        res.status(500).json({ error: 'Failed to retrieve response from the external API' });
    }
});

// --------------------------------------------------------------------------------------------


// Route to handle GET requests with 'prompt' and 'userID' query parameters
app.get('/chat/Qwen', async (req, res) => {
    const { prompt, key } = req.query;

    if (!prompt || !key) {
        return res.status(400).json({ error: 'Both prompt and key are required' });
    }

    // Validate the provided userID
    if (!validUserIDs.includes(key)) {
        return res.status(403).json({ error: 'Invalid key' });
    }

    try {
        const apiUrl = `https://api.kastg.xyz/api/ai/qwen-large?prompt=${encodeURIComponent(prompt)}&key=${apiKey}`;

        const response = await axios.get(apiUrl);

        // Send back the response from the external API
        res.json(response.data);
    } catch (error) {
        console.error('Error calling external API:', error.message);
        res.status(500).json({ error: 'Failed to retrieve response from the external API' });
    }
});


// --------------------------------------------------------------------------------------------


// Route to handle GET requests with 'prompt' and 'userID' query parameters
app.get('/chat/Blackbox', async (req, res) => {
    const { prompt, key } = req.query;

    if (!prompt || !key) {
        return res.status(400).json({ error: 'Both prompt and key are required' });
    }

    // Validate the provided userID
    if (!validUserIDs.includes(key)) {
        return res.status(403).json({ error: 'Invalid key' });
    }

    try {
        const apiUrl = `https://api.kastg.xyz/api/ai/blackbox?prompt=${encodeURIComponent(prompt)}&key=${apiKey}`;

        const response = await axios.get(apiUrl);

        // Send back the response from the external API
        res.json(response.data);
    } catch (error) {
        console.error('Error calling external API:', error.message);
        res.status(500).json({ error: 'Failed to retrieve response from the external API' });
    }
});


app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});