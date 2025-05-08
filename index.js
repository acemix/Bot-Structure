const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

/**
 * Creates a new Discord bot client with the necessary gateway intents:
 * - Guilds: Basic server events
 * - GuildMessages: Listen to messages in text channels
 * - MessageContent: Required to read message content (needed for prefix commands)
 */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Collections to store slash and prefix commands
client.commands = new Collection(); // For slash (/) commands
client.prefixCommands = new Collection(); // For prefix (!) commands

// Prefix used for traditional commands (e.g., !ip)
const prefix = '!';

// Path to the /commands directory
const commandsPath = path.join(__dirname, 'commands');

// Reads all .js files from the commands folder
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Load each command into its respective collection
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    // Store slash command if it exists
    if (command.data) {
        client.commands.set(command.data.name, command);
    }

    // Store prefix command if it exists
    if (command.executePrefix) {
        client.prefixCommands.set(command.name, command);
    }
}

// Event triggered when the bot is fully connected and ready
client.once('ready', () => {
    console.log(`Bot is ready! Logged in as ${client.user.tag}`);
});

// Handle traditional message-based (prefix) commands
client.on('messageCreate', message => {
    // Ignore messages that don't start with the prefix or come from bots
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Parse command name and arguments
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Retrieve the command from the collection
    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    // Execute the prefix command
    try {
        command.executePrefix(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error executing that command.');
    }
});

// Handle slash (/) interactions
client.on('interactionCreate', async interaction => {
    // Only respond to slash commands
    if (!interaction.isCommand()) return;

    // Get the corresponding command
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // Execute the slash command
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
    }
});

client.login('YOUR-TOKEN');