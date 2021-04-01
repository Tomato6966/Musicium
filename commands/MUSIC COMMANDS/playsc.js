const functions = require("../../functions")
const config = require("../../config.json")
const scdl = require("soundcloud-downloader").default;
module.exports = {
    name: "playsc",
    category: "MUSIC COMMANDS",
    aliases: ["psc", "playsoundclound"],
    cooldown: 5,
    useage: "playsc <URL/NAME>",
    description: "Plays a song, from soundcloud, whatever, or search it, or play a playlist",
    run: async (client, message, args) => {
        //if not a dj, return error Disabled - Because not needed 
        //if(functions.check_if_dj(message))
        //return functions.embedbuilder(client, 6000, message, config.colors.no, "DJ-ROLE", `❌ You don\'t have permission for this Command! You need to have: ${functions.check_if_dj(message)}`)

        //if member not connected return error
        if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")

        //if they are not in the same channel, return error only check if connected
        if (message.guild.me.voice.channel && message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)

        //if no arguments return error
        if (!args[0]) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " Please add something you wanna search to")
        
        //if not allowed to CONNECT to the CHANNEL
        if (!message.guild.me.permissionsIn(message.member.voice.channel).has("CONNECT"))  return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`join\` your Channel")

        //If bot not connected, join the channel
        if(!message.guild.me.voice.channel)
        message.member.voice.channel.join().catch(e=>{
            //send error if not possible
            return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`join\` your Channel")
        })
        
        //if not allowed to CONNECT to the CHANNEL
        if (!message.guild.me.permissionsIn(message.member.voice.channel).has("SPEAK")) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`speak\` your Channel")
        
        //send information message
        functions.embedbuilder(client, 5000, message, config.colors.yes, "🔎 Searching!", "```" + args.join(" ") + "```")
        
        //Search in soundcloud
        scdl.search('tracks', args.join(" "))
            .then(async results => {
                //send information message
                functions.embedbuilder(client, 10000, message, config.colors.yes, "🔎 Playing!", `[${results.collection[0].permalink}](${results.collection[0].permalink_url})`, results.collection[0].artwork_url)
                //play track
                return client.distube.play(message, results.collection[0].permalink_url)
            })
            .catch(err => console.log(err))

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
