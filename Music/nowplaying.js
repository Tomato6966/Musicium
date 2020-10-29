////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const createBar = require("string-progressbar");
const { Client, Collection, MessageEmbed } = require("discord.js");
const { attentionembed } = require("../util/attentionembed"); 
const {
  approveemoji,
  denyemoji,
  PREFIX,
} = require(`../config.json`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "nowplaying",
  aliases: ['np',"now-playing","current","current-song"],
  description: "Show current song",
  cooldown: 5,
  edesc: `Type nowplaying in chat, to see which song is currently playing! As well as how long it will take until its finished\nUsage: ${PREFIX}nowplaying`,
  
execute(message) {
    //if not in a guild return
    if(!message.guild) return;
    //get Server Queue
    const queue = message.client.queue.get(message.guild.id);
    //if nothing playing error
    if (!queue) return attentionembed(message, "There is nothing playing.").catch(console.error);
    //Define the current song
    const song = queue.songs[0];
    //define current time
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    //define left duration
    const left = song.duration - seek;
  
    //define embed
    let nowPlaying = new MessageEmbed()
      .setTitle("Now playing")
      .setDescription(`[**${song.title}**](${song.url})`)
      .setThumbnail("https://cdn.discordapp.com/attachments/748095614017077318/769672148524335114/unknown.png")
      .setColor("#c219d8")
      //if its a stream
      if(song.duration >= 10000) {
        nowPlaying.addField("\u200b", "🔴 LIVE", false);
        nowPlaying.setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8));
        //react with approve emoji
        message.react(approveemoji)
        //send approve msg
        return message.channel.send(nowPlaying);
      }
      //If its not a stream 
      if (song.duration > 0&&song.duration<10000) {
        nowPlaying.addField("\u200b", new Date(seek * 1000).toISOString().substr(11, 8) + "[" + createBar((song.duration == 0 ? seek : song.duration), seek, 20, "▬", "<:currentposition:770098066552258611>")[0] + "]" + (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)), false);
        nowPlaying.setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8));
        //react with approve emoji
        message.react(approveemoji)
        //send approve msg
        return message.channel.send(nowPlaying);
      }
  }
};
