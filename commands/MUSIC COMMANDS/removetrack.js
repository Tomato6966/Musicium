const functions = require("../../functions")
const config = require("../../config.json")
module.exports = {
    name: "removetrack",
    category: "MUSIC COMMANDS",
    aliases: ["rt"],
    useage: "removetrack <Queury Number>",
    description: "Removes a Specific Track",
    run: async (client, message, args) => {
        //if not a dj, return error
        if (functions.check_if_dj(message))
            return functions.embedbuilder(client, 6000, message, config.colors.no, "DJ-ROLE", `❌ You don\'t have permission for this Command! You need to have: ${functions.check_if_dj(message)}`)

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

        //if no args return
        if (!args[0]) return functions.embedbuilder(client, 3000, message, config.colors.no, "Please add the Track Position you want to Remove");
        
        //if args too big
        if (isNaN(args[0]) || Number(args[0]) >= queue.songs.length) return functions.embedbuilder(client, 3000, message, config.colors.no, "Your Song Position is out of RANGE! Max: " + queue.songs.length);

        //save the current track on a variable
        var track = queue.songs[Number(args[0])]

        //clear the queue
        queue.songs.splice(Number(args[0]), Number(args[0]) + 1);
        
        //Send info message
        functions.embedbuilder(client, 3000, message, config.colors.yes, "Success fully removed your Track", `[${track.name}](${track.url})`)
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
