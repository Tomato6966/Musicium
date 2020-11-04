////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");
const { Client, Collection } = require("discord.js");
const { attentionembed } = require("../util/attentionembed");
const { PREFIX } = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "queue",
  aliases: ["qu"],
  description: "Show the music queue and now playing.",
  cooldown: 7.5,
  edesc: `Type this command to play some music.\nUsage: ${PREFIX}queue`,
  execute(message) {
    //if not in a guild return
    if(!message.guild) return;
    //get serverqueue
    const queue = message.client.queue.get(message.guild.id);
    //if no queue aka nothing playing error
    if (!queue) return attentionembed(message, "There is nothing playing.").catch(console.error);
    //set description
    console.log(queue.songs);
    let description = "";
    for(let i = 0; i < queue.songs.length; i++){
      description += `**${i}.** [${queue.songs[i].title.substring(0,40)}](${queue.songs[i].url}) | \`${queue.songs[i].duration}\`\n`
    }
    //define queueembed
    let queueEmbed = new MessageEmbed()
      .setTitle("Music Queue")
      .setDescription(description)
      .setColor("#c219d8");
    //split the description
    const splitDescription = splitMessage(description, {
      maxLength: 2048,
      char: "\n",
      prepend: "",
      append: ""
    });
    //For every description send a new embed
    splitDescription.forEach(async (m) => {
      //(over)write embed description
      queueEmbed.setDescription(m);
      //react with emoji
      message.react("769665713124016128")
      //send embed
      message.channel.send(queueEmbed);
    });
  }
};
