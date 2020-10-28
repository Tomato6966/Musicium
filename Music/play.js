////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const { play } = require("../include/play");
const { YOUTUBE_API_KEY, 
  SOUNDCLOUD_CLIENT_ID,
 } = require("../config.json");
const ytdl = require("ytdl-core");
const fs = require('fs')
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const scdl = require("soundcloud-downloader");
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
  name: "play",
  aliases: ["p"],
  description: "Plays song from YouTube/Stream",
  cooldown: 1.5,
  edesc: `Type this command to play some music.\nUsage: ${PREFIX}play <TITLE | URL>`,
  
async execute(message, args, client) {
    //If not in a guild return
    if (!message.guild) return;
    //define channel
    const { channel } = message.member.voice;
    //get serverqueue
    const serverQueue = message.client.queue.get(message.guild.id);
    //If not in a channel return error
    if (!channel) return attentionembed(message, "Please join a Voice Channel first");
    //If not in the same channel return error
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return attentionembed(message, `You must be in the same Voice Channel as me`);
    //If no args return
    if (!args.length)
      return attentionembed(message, `Usage: ${message.client.prefix}play <YouTube URL | Video Name | Soundcloud URL>`);
    //react with approve emoji
    message.react(approveemoji).catch(console.error);
    //get permissions and send error if bot doesnt have enough
    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return attentionembed(message, "I need permissions to join your channel!");
    if (!permissions.has("SPEAK"))
      return attentionembed(message, "I need permissions to speak in your channel");
    //define some url patterns
    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
               //https://open.spotify.com/track/4gXX2ayvtMf4Tc5DCSHFTH?si=8iIK5KVaR2SbCiolD5IirA
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);
    //If its a playlist send it to playlist command and then back again
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").execute(message, args);
    }
    //define Queue Construct
    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 50,
      playing: true
    };
    //get song infos to null
    let songInfo = null;
    let song = null;
    //try catch for errors
    try {
      //If something is playing
      if (serverQueue) {
        //if its an url
        if (urlValid) { //send searching link
          message.channel.send(new MessageEmbed().setColor("#c219d8")
            .setDescription(`**<:youtube:769675858431705109> Searching 🔍 [\`LINK\`](${args.join(" ")})**`))
        //if not
        } else { //send searching TITLE
          message.channel.send(new MessageEmbed().setColor("#c219d8")
            .setDescription(`**<:youtube:769675858431705109> Searching 🔍 \`${args.join(" ")}\`**`))
        }
      } else {
        //If nothing is playing join the channel
        queueConstruct.connection = await channel.join();
        //send join message
        message.channel.send(new MessageEmbed().setColor("#c219d8")
          .setDescription(`**👍 Joined \`${channel.name}\` 📄 bouned \`#${message.channel.name}\`**`)
          .setFooter(`By: ${message.author.username}#${message.author.discriminator}`))
        //if its an url
        if (urlValid) { //send searching link
          message.channel.send(new MessageEmbed().setColor("#c219d8")
            .setDescription(`**<:youtube:769675858431705109> Searching 🔍 [\`LINK\`](${args.join(" ")})**`))
          //if not 
        } else { //send searching TITLE
          message.channel.send(new MessageEmbed().setColor("#c219d8")
            .setDescription(`**<:youtube:769675858431705109> Searching 🔍 \`${args.join(" ")}\`**`))
        }
        //Set selfdeaf and serverdeaf true
        queueConstruct.connection.voice.setSelfDeaf(true);
        queueConstruct.connection.voice.setDeaf(true);
      }
    }
    catch {
    }
    //if its a valdi youtube link
    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          subs: songInfo.videoDetails.author.subscriber_count,
          thumbnail: songInfo.videoDetails.thumbnail.thumbnails[4],
          duration: songInfo.videoDetails.lengthSeconds,
          author: songInfo.videoDetails.author.name,
          authorurl: songInfo.videoDetails.author.user_url,
        };
      } catch (error) {
        if (error.statusCode === 403) return attentionembed(message, "Max. uses of api Key, please refresh!");
        console.error(error);
        return attentionembed(message, error.message);
      }
    } 
    //if its a valid soundcloud link
    else if (scRegex.test(url)) {
      try {
        const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
        song = {
          title: trackInfo.title,
          url: trackInfo.permalink_url,
          duration: trackInfo.duration / 1000
        };
      } catch (error) {
        if (error.statusCode === 404)
          return attentionembed(message, "Couldn't find Soundcloud Title");
        return attentionembed(message, "An Error occured playing the soundcloud Titel");
      }
    
    }
    else if(url.includes("spotify")){
      return attentionembed(message, "Spotify not supported!");
    }
    else {
      try {
        const results = await youtube.searchVideos(search, 1);
       //get the result 
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          subs: songInfo.videoDetails.author.subscriber_count,
          thumbnail: songInfo.videoDetails.thumbnail.thumbnails[4],
          duration: songInfo.videoDetails.lengthSeconds,
          author: songInfo.videoDetails.author.name,
          authorurl: songInfo.videoDetails.author.user_url,
        };
      } catch (error) {
        console.error(error);
        return attentionembed(message, error);
      }
    }
    //get the thumbnail
    let thumb = "https://cdn.discordapp.com/attachments/748095614017077318/769672148524335114/unknown.png"
    if (song.thumbnail === undefined) thumb = "https://cdn.discordapp.com/attachments/748095614017077318/769672148524335114/unknown.png";
    else thumb = song.thumbnail.url;
    //if there is a server queue send that message!
    if (serverQueue) {
      //Calculate the estimated Time
      let estimatedtime = Number(0);
      for (let i = 0; i < serverQueue.songs.length; i++) {
        estimatedtime += Number(serverQueue.songs[i].duration);
      }
      if (estimatedtime > 60) {
        estimatedtime = Math.round(estimatedtime / 60 * 100) / 100;
        estimatedtime = estimatedtime + " Minutes"
      }
      else if (estimatedtime > 60) {
        estimatedtime = Math.round(estimatedtime / 60 * 100) / 100;
        estimatedtime = estimatedtime + " Hours"
      }
      else {
        estimatedtime = estimatedtime + " Seconds"
      }
      //Push the ServerQueue
      serverQueue.songs.push(song);
      //the new song embed
      const newsong = new MessageEmbed()
        .setTitle("<:Playing:769665713124016128> " + song.title)
        .setColor("#c219d8")
        .setThumbnail(thumb)
        .setURL(song.url)
        .setDescription(`\`\`\`Has been added to the Queue.\`\`\``)
        .addField("Estimated time until playing:", `\`${estimatedtime}\``, true)
        .addField("Position in queue", `**\`${serverQueue.songs.length - 1}\`**`, true)
        .setFooter(`Requested by: ${message.author.username}#${message.author.discriminator}`, message.member.user.displayAvatarURL({ dynamic: true }))
      //send the Embed into the Queue Channel
        return serverQueue.textChannel
        .send(newsong)
        .catch(console.error);
      
    }
    //push the song list by 1 to add it to the queu
    queueConstruct.songs.push(song);
    //set the queue
    message.client.queue.set(message.guild.id, queueConstruct);
    //playing with catching errors
    try {
      //try to play the song
      play(queueConstruct.songs[0], message, client);
    } catch (error) {
      //if an error comes log
      console.error(error);
      //delete the Queue
      message.client.queue.delete(message.guild.id);
      //leave the channel
      await channel.leave();
      //sent an error message
      return attentionembed(message, `Could not join the channel: ${error}`);
    }
  }
};

//////////////////////////////////////////
//////////////////////////////////////////
/////////////by Tomato#6966///////////////