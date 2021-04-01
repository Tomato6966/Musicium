const radio = require("../../radio")
const functions = require("../../functions")
const config = require("../../config.json")
module.exports = {
    name: "radio",
    category: "MUSIC COMMANDS",
    useage: "radio [radiostation] [volume]",
    description: "Play one of the 200 Radio Station, or see them by just typing  +radio  in the chat!",
    run: async (client, message, args) => {
        //if not allowed to CONNECT to the CHANNEL
        if (!message.guild.me.permissionsIn(message.member.voice.channel).has("CONNECT")) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`join\` your Channel")

        //If bot not connected, join the channel
        if (!message.guild.me.voice.channel)
            message.member.voice.channel.join().catch(e => {
                //send error if not possible
                return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`join\` your Channel")
            })

        //if not allowed to CONNECT to the CHANNEL
        if (!message.guild.me.permissionsIn(message.member.voice.channel).has("SPEAK")) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`speak\` your Channel")


        if (message.guild.me.voice.channel && args[0]) {
            //if not a dj, return error
            if (functions.check_if_dj(message))
                return functions.embedbuilder(client, 6000, message, config.colors.no, "DJ-ROLE", `<:declined:780403017160982538> You don\'t have permission for this Command! You need to have: ${functions.check_if_dj(message)}`)

            //If Bot not connected, return error
            if (!message.guild.me.voice.channel) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")

            //if member not connected return error
            if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")

            //if they are not in the same channel, return error
            if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)

            //stop the Distube
            try{
                client.distube.stop(message);
            }catch{
                console.log("JUST PLAY RADIO")
            }

            //execute the radio module
            return radio(client, message, args); //get the radio module
        } else {
            //execute the radio module
            return radio(client, message, args); //get the radio module
        }
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
