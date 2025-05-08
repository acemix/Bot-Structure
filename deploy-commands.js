const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

/**
 * This script registers (or refreshes) all slash (/) commands for the bot
 * by reading them from the `commands` directory and pushing them to Discord's API.
 */

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    commands.push(command.data.toJSON());
}

// Creates a new REST instance with API version 10 and sets your bot token
const rest = new REST({ version: '10' }).setToken('YOUR-TOKEN');

/**
 * Immediately invoked async function to register all application (slash) commands.
 * Sends a PUT request to the Discord API to overwrite existing global commands.
 */
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        // Register all commands globally using the application ID
        await rest.put(
            Routes.applicationCommands('YOUR-APLICATION-ID'),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        // Logs any error that occurs during registration
        console.error(error);
    }
})();