////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const { Client, Collection, MessageEmbed } = require("discord.js");
const scdl = require("soundcloud-downloader");
const { play } = require("../include/play");
const { YOUTUBE_API_KEY, MAX_PLAYLIST_SIZE } = require("../config.json");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
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
  name: "playlist",
  aliases: ["pl"],
  description: "Play a playlist from youtube",
  cooldown: 5,
  edesc: `Type this command to play a playlist.\nUsage: ${PREFIX}playlist <TITLE | URL>`,

async execute(message, args,client) {
    //If its not in a guild return
    if(!message.guild) return;
    //Define channel
    const { channel } = message.member.voice;
    //get serverqueue
    const serverQueue = message.client.queue.get(message.guild.id);
    //if something is playing and not the same channel do this
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return attentionembed(message,`You must be in the same channel as me`)
    //If no args return error
    if (!args.length)
      return attentionembed(message,`Usage: ${message.client.prefix}playlist <YouTube Playlist URL | Playlist Name>`)
    //if no channel return error
    if (!channel) return attentionembed(message, "You need to join a voice channel first!")
    //get bot permissions
    const permissions = channel.permissionsFor(message.client.user);
    //if bot cant connect send error
    if (!permissions.has("CONNECT"))
      return attentionembed(message, "Cannot connect to voice channel, missing permissions");
    //If bot cant speak send error
    if (!permissions.has("SPEAK"))
      return attentionembed(message, "I cannot speak in this voice channel, make sure I have the proper permissions!");
    //define patterns
    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = pattern.test(args[0]);
    //Set queueconstruct
    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 50,
      playing: true
    };
    //set everything null
    let song = null;
    let playlist = null;
    let videos = [];
    //try some url testing if its an url from youtube
    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: "snippet" });
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return attentionembed(message,"Playlist not found")
      }
    } 
    //if its an soundcloud url
    else if (scdl.isValidUrl(args[0])) {
      if (args[0].includes("/sets/")) {
        playlist = await scdl.getSetInfo(args[0], SOUNDCLOUD_CLIENT_ID);
        videos = playlist.tracks.map((track) => ({
          title: track.title,
          url: track.permalink_url,
          duration: track.duration / 1000
        }));
      }
    } 
    //if no url try to search it 
    else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
        playlist = results[0];
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return attentionembed(message,"Playlist not found")
      }
    }
    //loop all songs of the playlist
    videos.forEach((video) => {
      song = {
        title: video.title,
        url: video.url,
        duration: video.durationSeconds
      };
      //if there is something playing
      if (serverQueue) {
        //push the songs
        serverQueue.songs.push(song);
      } else {
        //if nothing playing push the songs and send join message
        message.channel.send(new MessageEmbed().setColor("#c219d8")
        .setDescription(`**👍 Joined \`${channel.name}\` 📄 bouned \`#${message.channel.name}\`**`)
        .setFooter(`By: ${message.author.username}#${message.author.discriminator}`))
        //push the songs
        queueConstruct.songs.push(song);
      }
    });
    //If the its a url 
    if (urlValid) {
      //send this
      message.channel.send(new MessageEmbed().setColor("#c219d8")
        .setDescription(`**<:youtube:769675858431705109> Searching Playist 🔍 [\`LINK\`](${args.join(" ")})**`))
    } 
    //if not
    else {
      //send this
      message.channel.send(new MessageEmbed().setColor("#c219d8")
        .setDescription(`**<:youtube:769675858431705109> Searching Playist 🔍 \`${args.join(" ")}\`**`))
    }
    //define the EMbed
    let playlistEmbed = new MessageEmbed()
      .setTitle(`<:Playing:769665713124016128> ${playlist.title}`)
      .setURL(playlist.url)
      .setColor("#c219d8")
      .setFooter("Started by: " + message.author.tag);
    //set description
      playlistEmbed.setDescription(queueConstruct.songs.map((song, index) => `\`${index + 1}.\` ${song.title} \`${Math.round(song.duration / 60 * 100) / 100} Minutes\``));
      if (playlistEmbed.description.length >= 2048)
        playlistEmbed.description =
          playlistEmbed.description.substr(0, 2007) + "\nPlaylist larger than character limit...";
    //send the playlist embed
    message.channel.send(playlistEmbed);
    //if nothing playing set the serverqueue
    if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);
    //if nothing playing 
    if (!serverQueue) {
      try {
        //try to join the channel
        queueConstruct.connection = await channel.join();
        //set selfdeaf true
        await queueConstruct.connection.voice.setSelfDeaf(true);
        await queueConstruct.connection.voice.setDeaf(true);
        //play the newest song
        play(queueConstruct.songs[0], message);
      } 
      //if error
      catch (error) {
        //log it
        console.error(error);
        //delete the queue
        message.client.queue.delete(message.guild.id);
        //leave the channel
        await channel.leave();
        //return error message
        return attentionembed(message, `Could not join the channel: ${error}`)
      }
    }
  }
};
