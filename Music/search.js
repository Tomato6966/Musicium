////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const ytsr = require("youtube-sr")
const { Client, Collection, MessageEmbed } = require("discord.js");
const { attentionembed } = require("../util/attentionembed");
const { PREFIX } = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "search",
  description: "Search and select videos to play",
  aliases: ["find"],
  cooldown: 3,
  edesc: `Type this Command to find first 5 results for your song!\nUsage: ${PREFIX}search <TITEL | URL>`,

async execute(message,args,client) {
    //if its not in a guild return
    if(!message.guild) return;
     //define channel
     const { channel } = message.member.voice;
     //get serverqueue
     const serverQueue = message.client.queue.get(message.guild.id);
    //react with approve emoji
    message.react("769665713124016128").catch(console.error);
    //if the argslength is null return error
    if (!args.length)
      return attentionembed(message,`Usage: ${message.client.prefix}${module.exports.name} <Video Name>`)
    //if there is already a search return error
    if (message.channel.activeCollector)
      return attentionembed(message,"There is a search active!");
    //if the user is not in a voice channel return error
    if (!message.member.voice.channel)
      return attentionembed(message,"Please join a Voice Channel first")
       //If not in the same channel return error
    if (serverQueue && channel !== message.guild.me.voice.channel)
    return attentionembed(message, `You must be in the same Voice Channel as me`);
    //define search
    const search = args.join(" ");
    //define a temporary Loading Embed
    let temEmbed = new MessageEmbed()
    .setAuthor("Searching...", "https://cdn.discordapp.com/emojis/757632044632375386.gif?v=1")
    .setColor("#f300e5")
    //define the Result Embed
    let resultsEmbed = new MessageEmbed()
      .setTitle("<:Playing:769665713124016128> Results for: ")
      .setDescription(`\`${search}\``)
      .setColor("#f300e5")
      .setFooter("Response with your favorite number", client.user.displayAvatarURL() )
    //try to find top 5 results
    try {
      //find them
      const results = await ytsr.search(search, { limit: 5 });
      //map them and sort them and add a Field to the ResultEmbed
      results.map((video, index) => resultsEmbed.addField(video.url, `${index + 1}. ${video.title}`));
      // send the temporary embed
      const resultsMessage = await message.channel.send(temEmbed)
      //react with 5 Numbers
        await resultsMessage.react("769932441967263754");
        await resultsMessage.react("769932441909067786");
        await resultsMessage.react("769932441946816542");
        await resultsMessage.react("769932569235292170");
        await resultsMessage.react("769933892014440448");
      //edit the resultmessage to the resultembed
        await resultsMessage.edit(resultsEmbed)
      //set the collector to true
      message.channel.activeCollector = true;
      //wait for a response
      let response;
      await resultsMessage.awaitReactions((reaction, user) => user.id == message.author.id,
      {max: 1, time: 60000, errors: ['time'],} ).then(collected => {
        //if its one of the emoji set them to 1 / 2 / 3 / 4 / 5
          if(collected.first().emoji.id == "769932441967263754"){ return response = 1; }
          if(collected.first().emoji.id == "769932441909067786"){ return response = 2; }
          if(collected.first().emoji.id == "769932441946816542"){ return response = 3; }
          if(collected.first().emoji.id == "769932569235292170"){ return response = 4; }
          if(collected.first().emoji.id == "769933892014440448"){ return response = 5; }
          //otherwise set it to error
          else{
            response = "error";
          }
        });
        //if response is error return error
      if(response === "error"){
        //send error message
        attentionembed(message,"Please use a right emoji!");
        //try to delete the message
        return resultsMessage.delete().catch(console.error);
      }
      //get the field name of the response
      const choice = resultsEmbed.fields[parseInt(response) - 1].name;
      //set collector to false aka off
      message.channel.activeCollector = false;
      //play the collected song
      message.client.commands.get("play").execute(message, [choice]);
      //delete the search embed
      resultsMessage.delete().catch(console.error);
      //catch any errors while searching
    } catch (error) {
      //log them
      console.error(error);
      //set collector false, just incase its still true
      message.channel.activeCollector = false;
    }
  }
};
