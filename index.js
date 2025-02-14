require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

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
const randomTexts = process.env.RESPONSES.split(',');
const userLastMessage = new Map();

// Generates a random color in hexadecimal format
function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);
});

// Listen for messages
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Help Command with Embed
    if (message.content.startsWith('-help')) {
        const helpEmbed = new EmbedBuilder()
            .setTitle("📌 Help Commands")
            .setColor(getRandomColor())
            .setDescription("List of available commands:")
            .addFields(
                { name: "`-help`", value: "Show this help message." },
                { name: "`-stick <message>`", value: "Set a sticky message in the channel." },
                { name: "`-unsticky`", value: "Remove the sticky message from the channel." }
            )
            .setFooter({ text: "STICKY MESSAGE | made by Raqkidsss" });

        return message.channel.send({ embeds: [helpEmbed] });
    }

    // Command to set a sticky message
    if (message.content.startsWith('-stick')) {
        const content = message.content.slice(7).trim();
        if (!content) return message.reply('❌ Please provide a sticky message.');

        stickyMessages.set(message.channel.id, { content, lastMessage: null });

        const stickEmbed = new EmbedBuilder()
            .setTitle("✅ Sticky Message Set!")
            .setColor(getRandomColor())
            .setDescription(`Message: **${content}**`);

        return message.channel.send({ embeds: [stickEmbed] });
    }

    // Command to remove the sticky message
    if (message.content.startsWith('-unsticky')) {
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

    // API Key DM Command
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

// Login to Discord with your app's token
client.login(process.env.TOKEN);
