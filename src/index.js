const { Client, Partials } = require(`discord.js`);
const client = new Client({
    intents:
        [
            'GuildVoiceStates',
            'GuildMessageReactions',
            'GuildMessages',
            'MessageContent',
            'DirectMessages',
            'GuildMembers',
            'Guilds'
        ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMessageReactions,
        Partials.MessageReactionAdd,
        Partials.MessageReactionRemove,
        Partials.Reaction,
        Partials.VoiceStateUpdate,
    ],

}); //Guilds, GuildMembers : REQUIRED
const config = require('../config.json');
const fs = require('fs');
const { eventsHandler } = require('./functions/handlers/handelEvents');
const path = require('path');
const {checkMissingIntents} = require('./functions/handlers/requiredIntents');
const {antiCrash} = require('./functions/handlers/antiCrash');
antiCrash();
require('./functions/handlers/watchFolders');

const eventsPath = './events';


const errorsDir = path.join(__dirname, '../../../errors');

function ensureErrorDirectoryExists() {
    if (!fs.existsSync(errorsDir)) {
        fs.mkdirSync(errorsDir);
    }
}

function logErrorToFile(errorMessage) {
    ensureErrorDirectoryExists();
    const fileName = `${new Date().toISOString().replace(/:/g, '-')}.txt`;
    const filePath = path.join(errorsDir, fileName);
    fs.writeFileSync(filePath, errorMessage.toString(), 'utf8');
}

(async () => {
    try {
        await client.login(config.bot.token);
        console.log('SUCCESS: ' + 'Bot logged in successfully!');
        require('../admin/dashboard')


        await eventsHandler(client, path.join(__dirname, eventsPath));
        checkMissingIntents(client);
    } catch (error) {
        if (error.message === "An invalid token was provided.") {
            console.error('ERROR: ' + 'The token provided for the Discord bot is invalid. Please check your configuration.');
            logErrorToFile(error)
        } else {
            console.error('ERROR: ' + 'Failed to log in:', error);
            logErrorToFile(error)
        }
    }
})();
module.exports = client;


//* You can start writing your custom bot logic from here. Add new features, commands, or events!

