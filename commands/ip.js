const { SlashCommandBuilder } = require('discord.js');

/**
 * Created by Acemix [Bilzox Studios]
 * Discord: Structure for Bot Multilang
 * Supports both slash commands and prefix commands.
 */

module.exports = {
    /**
     * Slash command definition using discord.js's SlashCommandBuilder
     * Command name: /ip
     * Description: Returns the server IP
     */
    data: new SlashCommandBuilder()
        .setName('ip')
        .setDescription('Server IP'),

    // Internal command name, used by the command handler
    name: 'ip',

    /**
     * Executes the slash command when a user types /ip
     * @param {CommandInteraction} interaction - The interaction object representing the slash command
     */
    async execute(interaction) {
        const spanishRoleId = 'SPANISH-ID-ROLE';
        const englishRoleId = 'ENGLISH-ID-ROLE';

        let messageContent = 'IP: yourserver.com';

        if (interaction.member.roles.cache.has(spanishRoleId)) {
            messageContent = 'IP: tuservidor.com';
        }
        else if (interaction.member.roles.cache.has(englishRoleId)) {
            messageContent = 'IP: yourserver.com';
        }

        await interaction.reply(messageContent);
    },

    /**
     * Executes the prefix command when a user types !ip (or similar, depending on prefix)
     * @param {Message} message - The message object from discord.js
     * @param {Array<string>} args - The arguments passed with the command
     */
    executePrefix(message, args) {
        const spanishRoleId = 'SPANISH-ID-ROLE';
        const englishRoleId = 'ENGLISH-ID-ROLE';

        let messageContent = 'IP: yourserver.com';

        if (message.member.roles.cache.has(spanishRoleId)) {
            messageContent = 'IP: tuservidor.com';
        }
        else if (message.member.roles.cache.has(englishRoleId)) {
            messageContent = 'IP: yourserver.com';
        }

        message.reply(messageContent);
    },
};
