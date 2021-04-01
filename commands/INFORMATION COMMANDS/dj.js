const functions = require("../../functions")
const config = require("../../config.json")
module.exports = {
    name: "dj",
    aliases: ["dj"],
    category: "INFORMATION COMMANDS",
    description: "What is the DJ ROLE",
    useage: "dj",
    run: async (client, message, args) => {
        if (!functions.check_if_dj(message))
            return functions.embedbuilder(client, 6000, message, config.colors.no, "DJ-ROLE", `❌ There are no DJ ROLES`)  

        return functions.embedbuilder(client, "null", message, config.colors.yes, "DJ-ROLE", `These are the DJ ROLES`, `${functions.check_if_dj(message)}`)
    }
}

/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
