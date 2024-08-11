const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const { command } = require('./command');

// Create a new Discord client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages] });

// Command prefix and channel ID from environment variables
const prefix = '*';
const allowedChannelId = process.env.CHANNELID;

// List of random texts
const randomTexts = process.env.RESPONSES.split(',');

// Store the last random text sent to each user
const userLastMessage = new Map();

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Listen for messages
client.on('messageCreate', async message => {
    // Ignore messages from bots and those that don't start with the prefix
    if (message.author.bot || !message.content.startsWith(`${prefix}apikey`)) return;

    // Check if the command is used in the allowed channel
    if (message.channel.id !== allowedChannelId) {
        return message.channel.send('This command can only be used in a specific channel.');
    }

    const userId = message.author.id;
    let randomText;

    // Check if we have a stored random text for this user
    if (userLastMessage.has(userId)) {
        randomText = userLastMessage.get(userId);
    } else {
        // If no stored text, pick a new random text
        randomText = randomTexts[Math.floor(Math.random() * randomTexts.length)];
    }

    try {
        // Send the random text as a DM
        await message.author.send(`# Don't share this!\n\n\n**Your Key: __${randomText}__**`);

        // Store the random text for the user
        userLastMessage.set(userId, randomText);
    } catch (error) {
        // If DM fails, send a message in the channel
        message.channel.send(`${message.author}, Please check your security settings to allow direct messages.`);
    }
});

// Login to Discord with your app's token
client.login(process.env.TOKEN);