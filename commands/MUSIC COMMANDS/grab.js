const functions = require("../../functions")
const config = require("../../config.json")
const Canvas = require('canvas');
const Discord = require("discord.js");
module.exports = {
    name: "grab",
    category: "MUSIC COMMANDS",
    aliases: ["yoink", "save"],
    useage: "grab",
    description: "Saves current song in your DM",
    run: async (client, message, args) => {
        //if not a dj, return error - DISABLED BECAUSE NOT NEEDED
        //if (functions.check_if_dj(message))
        //    return functions.embedbuilder(client, 6000, message, config.colors.no, "DJ-ROLE", `❌ You don\'t have permission for this Command! You need to have: ${functions.check_if_dj(message)}`)

        //If Bot not connected, return error
        if (!message.guild.me.voice.channel) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")

        //if member not connected return error
        if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")

        //if they are not in the same channel, return error
        if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)
        
        //get queue
        let queue = client.distube.getQueue(message);
        
        //if no queue return error
        if (!queue) return functions.embedbuilder(client, 3000, message, config.colors.no, "There is nothing playing!");

        //send info msg
        return message.channel.send(new MessageEmbed()
            .setAuthor(`Current song playing:`, message.author.displayAvatarURL({
                dynamic: true
            }))
            .setThumbnail(`https://img.youtube.com/vi/${queue.songs[0].id}/mqdefault.jpg`)
            .setURL(queue.songs[0].url)
            .setColor(config.colors.yes)
            .setFooter(client.user.username + " | by milrato.eu", client.user.displayAvatarURL())
            .setTitle(`**:notes: Song Saved**`)
            .addField(`Duration: `, `\`${queue.songs[0].formattedDuration}\``, true)
            .addField(`Play it: `, `\`${prefix}play ${queue.songs[0].url}\``, true)
            .addField(`Download it: `, `[\`CLICK HERE\`](${queue.songs[0].streamURL})`, true)
            .setFooter(`Requested by: ${queue.songs[0].user.tag}`, queue.songs[0].user.displayAvatarURL({
                dynamic: true
            }))
        )
    }
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
