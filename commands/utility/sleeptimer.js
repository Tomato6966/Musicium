const functions = require("../../functions")
const config = require("../../config.json")
module.exports = {
    name: "sleeptimer",
    category: "utility",
    aliases: ["sleep"],
    useage: "sleeptimer <Duration in Hours>",
    description: "Sets a sleep timer which will stop the bot / leave the channel, and kick you out of the channel after the hours of duration you set",
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
        
        //if no args return error
        if (!args[0]) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + "Please add the amount of \"sleep\" you wanna add, in hours please.")
       
        //send information message 
        functions.embedbuilder(client, "null", message, config.colors.no, "Sleeptimer set", `I will leave the Channel in \`${args[0]} hours\``)
        
        //wait until the time ended
        setTimeout(() => {
            //Send information message
            functions.embedbuilder(client, "null", message, config.colors.no, "STOPPED!", `Left the channel`)
            //kick the user
            message.member.voice.setChannel(null)
            //send information to the user
            message.author.send(`Sleep well, ${message.author} :zzz:`).catch(e=>console.log("zzz"));
            //stop distube
            client.distube.stop(message);
            //leave the channel
            message.member.voice.channel.leave().catch(e=>console.log("zzz"));
        }, Number(args[0]) * 1000 * 60 * 60)
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
