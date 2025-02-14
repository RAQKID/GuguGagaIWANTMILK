require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField } = require('discord.js');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Discord Bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
});

const stickyMessages = new Map();
const prefix = '*';
const allowedChannelId = process.env.CHANNELID;
const randomTexts = process.env.RESPONSES ? process.env.RESPONSES.split(',') : [];
const userLastMessage = new Map();

// Generates a random color in hexadecimal format
function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

// Express Home Route (Server Status Check)
app.get('/', (req, res) => {
    res.json({
        status: 'running',
        bot: client.user ? client.user.tag : 'Not logged in',
        uptime: process.uptime(),
    });
});

// Start Express Server
app.listen(PORT, () => {
    console.log(`🚀 Express server running on http://localhost:${PORT}`);
});

// Discord Bot Ready Event
client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);
});

// Function to check if a user has ADMINISTRATOR permission
function hasAdminPermission(member) {
    return member.permissions.has(PermissionsBitField.Flags.Administrator);
}

// Listen for messages
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Help Command with ADMINISTRATOR Permission Check
    if (message.content.startsWith('-help')) {
        if (!hasAdminPermission(message.member)) {
            return message.reply('❌ You do not have permission to use this command.');
        }

        const helpEmbed = new EmbedBuilder()
            .setTitle("📌 Help Commands")
            .setColor(getRandomColor())
            .setDescription("List of available commands:")
            .addFields(
                { name: "`-help`", value: "Show this help message. (Admin only)" },
                { name: "`-stick <message>`", value: "Set a sticky message in the channel. (Admin only)" },
                { name: "`-unsticky`", value: "Remove the sticky message from the channel. (Admin only)" }
            )
            .setFooter({ text: "STICKY MESSAGE | made by Raqkidsss" });

        return message.channel.send({ embeds: [helpEmbed] });
    }

    // Command to set a sticky message (Admin Only)
    if (message.content.startsWith('-stick')) {
        if (!hasAdminPermission(message.member)) {
            return message.reply('❌ You do not have permission to use this command.');
        }

        const content = message.content.slice(7).trim();
        if (!content) return message.reply('❌ Please provide a sticky message.');

        stickyMessages.set(message.channel.id, { content, lastMessage: null });

        const stickEmbed = new EmbedBuilder()
            .setTitle("✅ Sticky Message Set!")
            .setColor(getRandomColor())
            .setDescription(`Message: **${content}**`);

        return message.channel.send({ embeds: [stickEmbed] });
    }

    // Command to remove the sticky message (Admin Only)
    if (message.content.startsWith('-unsticky')) {
        if (!hasAdminPermission(message.member)) {
            return message.reply('❌ You do not have permission to use this command.');
        }

        if (!stickyMessages.has(message.channel.id)) {
            return message.reply('❌ There is no sticky message set in this channel.');
        }

        const stickyData = stickyMessages.get(message.channel.id);
        if (stickyData.lastMessage) {
            try {
                await stickyData.lastMessage.delete();
            } catch (err) {
                console.error('⚠️ Failed to delete sticky message:', err);
            }
        }

        stickyMessages.delete(message.channel.id);

        const unstickEmbed = new EmbedBuilder()
            .setTitle("🚫 Sticky Message Removed")
            .setColor(getRandomColor())
            .setDescription("The sticky message has been successfully removed.");

        return message.channel.send({ embeds: [unstickEmbed] });
    }

    // Handle sticky messages
    const stickyData = stickyMessages.get(message.channel.id);
    if (stickyData) {
        if (stickyData.lastMessage) {
            try {
                await stickyData.lastMessage.delete();
            } catch (err) {
                console.error('⚠️ Failed to delete sticky message:', err);
            }
        }

        stickyData.lastMessage = await message.channel.send(stickyData.content);
    }

    // API Key DM Command (NO ADMIN CHECK - Available to all users)
    if (message.content.startsWith(`${prefix}apikey`)) {
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
    }
});

// Login to Discord with your bot's token
client.login(process.env.TOKEN);
