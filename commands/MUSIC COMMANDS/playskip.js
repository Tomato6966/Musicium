const functions = require("../../functions")
const config = require("../../config.json")
var {
  getPreview
} = require("spotify-url-info");
module.exports = {
  name: "playskip",
  category: "MUSIC COMMANDS",
  aliases: ["ps"],
  useage: "playskip <URL/NAME>",
  description: "Plays new song and skips current",
  run: async (client, message, args) => {
    //if not a dj, return error
    if(functions.check_if_dj(message))
    return functions.embedbuilder(client, 6000, message, config.colors.no, "DJ-ROLE", `❌ You don\'t have permission for this Command! You need to have: ${functions.check_if_dj(message)}`)

    //if member not connected return error
    if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")

    //if they are not in the same channel, return error only check if connected
    if (message.guild.me.voice.channel && message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)

    //if no args return error
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

    //if bot not connected use play
    if (!message.guild.me.voice.channel) {
      //send information msg
      functions.embedbuilder(client, 5000, message, config.colors.yes, "Searching!", "```" + args.join(" ") + "```")
      //return + play the track
      return client.distube.play(message, args.join(" "));
    }

    //send information message
    functions.embedbuilder(client, 5000, message, config.colors.yes, "Searching and SKIPPING!", "```" + args.join(" ") + "```")
    
    //if its a spotify track then get preview data and use it
    if (args.join(" ").includes("track") && args.join(" ").includes("open.spotify")) {
      //get the song data
      let info = await getPreview(args.join(" "));
      //return + playskip
      return client.distube.playSkip(message, info.artist + " " + info.title);
    } 
    //if its a playlist of some kind send error
    else if (args.join(" ").includes("playlist") || args.join(" ").includes("deezer")) return message.reply("**:x: Playlists are not supported for playskip -_-**")
    //use the distube pkg to play and skip
    else {
      return client.distube.playSkip(message, args.join(" "));
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
