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
  name: "remove",
  description: "Remove song from the queue",
  aliases: ["delete"],
  cooldown: 1.5,
  edesc: `Type this command to remove a specific song from the queue.\nUsage: ${PREFIX}remove <Queue num.>`,

execute(message, args) {
  //if its not a guild return
    if(!message.guild) return;
    //get the queue
    const queue = message.client.queue.get(message.guild.id);
    //if there is no queue return error
    if (!queue) return attentionembed(message,"There is no Queue");
    //if he isnt in the same voice channel as the bot
    if (!canModifyQueue(message.member)) return;
    //if no args then return error
    if (!args.length) return attentionembed(message,`Try: ${message.client.prefix}remove <Queue Number>`);
    //If not a number then return error
    if (isNaN(args[0])) return attentionembed(message,`Try: ${message.client.prefix}remove <Queue Number>`);
    //get the song
    const song = queue.songs.splice(args[0], 1);
    //react with approve
    message.react("769665713124016128")
    //send approve
    queue.textChannel.send(new MessageEmbed()
    .setDescription(`<:no:770326304473350145> | ${message.author} removed **${song[0].title}** from the Queue`)
    .setColor("#c219d8")
    );
  }
};
