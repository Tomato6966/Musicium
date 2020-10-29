const { canModifyQueue } = require("../util/MilratoUtil");
const { Client, Collection, MessageEmbed } = require("discord.js");

const { attentionembed } = require("../util/attentionembed"); 
const {
  approveemoji,
  denyemoji,
  PREFIX,
} = require(`../config.json`);
module.exports = {
  name: "pause",
  description: "Pause the currently playing music",
  cooldown: 5,
  edesc: `Type this command to pause the Song!\nUsage: ${PREFIX}pause`,
  execute(message) {
    if(!message.guild) return;
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return attentionembed(message, "There is nothing playing").catch(console.error);
   
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
    
      queue.playing = false;
     
      queue.connection.dispatcher.pause(true);
      
      const pausemebed = new MessageEmbed().setColor("#c219d8")
      .setAuthor(`${message.author.username} paused the music.`, "https://cdn.discordapp.com/emojis/769912238236106793.png")
      
      message.react(approveemoji)
     
      return queue.textChannel.send(pausemebed).catch(console.error);
    }
  }
};
