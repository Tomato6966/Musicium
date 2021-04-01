const functions = require("../../functions")
const config = require("../../config.json")
var {
  getData,
  getPreview
} = require("spotify-url-info");
const DeezerPublicApi = require('deezer-public-api');
let deezer = new DeezerPublicApi();
module.exports = {
  name: "join",
  category: "MUSIC COMMANDS",
  aliases: ["connect", "summon"],
  cooldown: 5,
  useage: "join",
  description: "Joins the Voice Channel",
  run: async (client, message, args) => {
    //if user not connected return
    if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")
    
    //if bot is connected somewhere return
    if(message.guild.me.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, " I am already connected somewhere")
   
    //if not allowed to CONNECT to the CHANNEL
    if (!message.guild.me.permissionsIn(message.member.voice.channel).has("CONNECT"))
      return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`join\` your Channel")

    //try to join the channel
    message.member.voice.channel.join().catch(e=>{
      return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`join\` your Channel")
    })
   
    //send info msg
    functions.embedbuilder(client, 5000, message, config.colors.yes, "Joined your Channel", `Play Tracks with: \`${prefix}play\``)

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
