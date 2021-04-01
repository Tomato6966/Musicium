const functions = require("../../functions")
const config = require("../../config.json")
module.exports = {
  name: "status",
  category: "MUSIC COMMANDS",
  useage: "status",
  aliases: ["settings"],
  description: "Shows queue status/settings",
  run: async (client, message, args) => {
    //if not a dj, return error  - DISABLED BECAUSE NOT A DJ CMD
    //if(functions.check_if_dj(message))
    //return functions.embedbuilder(client, 6000, message, config.colors.no, "DJ-ROLE", `❌ You don\'t have permission for this Command! You need to have: ${functions.check_if_dj(message)}`)

    //If Bot not connected, return error
    if (!message.guild.me.voice.channel) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")
    
    //if member not connected return error
    if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")
    
    //if they are not in the same channel, return error
    if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)
        
    //get the queue 
    let queue = client.distube.getQueue(message);
    
    //if no queue, return error
    if (!queue) return functions.embedbuilder(client, "null", message, config.colors.no, "There is nothing playing!");

    //send the curembed from the function
    return message.channel.send(functions.curembed(client, message));
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
