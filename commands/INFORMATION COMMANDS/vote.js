const Discord = require("discord.js")
const config = require("../../config.json")
module.exports = {
    name: "vote",
    aliases: ["rate"],
    category: "INFORMATION COMMANDS",
    description: "Votes for Musicium",
    useage: "vote",
    run: async (client, message, args) => {
        return message.reply(
            new Discord.MessageEmbed()
            .setColor(config.colors.yes)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setTitle("Vote for Musicium")
            .setURL("https://top.gg/bot/769642999227351070/vote")
            .setDescription(`[Every Vote is appreciated THANKS! <3](https://top.gg/bot/769642999227351070/vote)`)
        )
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
