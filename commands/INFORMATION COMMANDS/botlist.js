const Discord = require("discord.js")
const config = require("../../config.json")
module.exports = {
    name: "botlist",
    aliases: ["botlist"],
    category: "INFORMATION COMMANDS",
    description: "Shows all Bot lists of where This Bot is in",
    useage: "ping",
    run: async (client, message, args) => {
        return message.reply(new Discord.MessageEmbed().setColor("#c219d8")
            .setTitle("Here is a list for all Bot-Lists this Bot is on!")
            .addField("Matrixbots", "https://www.matrixbots.xyz/bots/769642999227351070/")
            .addField("top.gg", "https://top.gg/bot/769642999227351070")
            .addField("bots.ondiscord", "https://bots.ondiscord.xyz/bots/769642999227351070")
            .addField("discordbotlist", "https://discordbotlist.com/bots/musicium")
        );
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
