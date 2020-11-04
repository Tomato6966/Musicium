////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const { canModifyQueue } = require("../util/MilratoUtil");
const { Client, Collection, MessageEmbed } = require("discord.js");
const { attentionembed } = require("../util/attentionembed");
const { PREFIX } = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "shuffle",
  aliases: ["mix"],
  description: "Shuffles the current Queue!",
  cooldown: 5,
  edesc: `Type the Command, if a Queue exists to change to Order of the Queue, randomly.\nUsage: ${PREFIX}shuffle`,

execute(message,args,client) {
    //if not in a guild return
    if(!message.guild) return;
    //react with approve emoji
    message.react("769665713124016128").catch(console.error);
    //get the Queue
    const queue = message.client.queue.get(message.guild.id);
    //if no queue return error
    if (!queue) return attentionembed(message, "There is no Queue.");
    //if not in the same channel as the bot
    if (!canModifyQueue(message.member)) return;
    //get all queue songs
    let songs = queue.songs;
    //make an array and mix them
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    //define queue.songs
    queue.songs = songs;
    //set the Queue
    message.client.queue.set(message.guild.id, queue);
    //send the Approve message
    queue.textChannel.send(new MessageEmbed()
    .setDescription(`**✅ | ${message.author} shuffled the Queue**`)
    .setColor("#c219d8")).catch(console.error);
  }
};
