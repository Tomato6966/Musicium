const functions = require("../../functions")
const config = require("../../config.json")
var {
  getData,
  getPreview
} = require("spotify-url-info");
const DeezerPublicApi = require('deezer-public-api');
let deezer = new DeezerPublicApi();
module.exports = {
  name: "play",
  category: "MUSIC COMMANDS",
  aliases: ["p"],
  cooldown: 5,
  useage: "play <URL/NAME>",
  description: "Plays a song, from youtube, soundcloud or whatever, or search it, or play a playlist",
  run: async (client, message, args) => {
    //if not a dj, return error Disabled - Because not needed 
    //if(functions.check_if_dj(message))
    //return functions.embedbuilder(client, 6000, message, config.colors.no, "DJ-ROLE", `❌ You don\'t have permission for this Command! You need to have: ${functions.check_if_dj(message)}`)

    //if member not connected return error
    if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")

    //if they are not in the same channel, return error only check if connected
    if (message.guild.me.voice.channel && message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)

    //if no arguments return error
    if (!args[0])  return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " Please add something you wanna search to")
    
    //if not allowed to CONNECT to the CHANNEL
    if (!message.guild.me.permissionsIn(message.member.voice.channel).has("CONNECT"))  return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`join\` your Channel")

    //If bot not connected, join the channel
    if(!message.guild.me.voice.channel)
    message.member.voice.channel.join().catch(e=>{
        //send error if not possible
        return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`join\` your Channel")
    })
    
    //if not allowed to CONNECT to the CHANNEL
    if (!message.guild.me.permissionsIn(message.member.voice.channel).has("SPEAK")) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`speak\` your Channel")

    //send information message
    functions.embedbuilder(client, 5000, message, config.colors.yes, "🎶  Searching!", "```" + args.join(" ") + "```")
    
    //do things for deezer
    if (args.join(" ").includes("deezer")) {
      //Get album list for the given artist id
      let track = args.join(" ").split("/")

      track = track[track.length - 1]
      deezer.playlist.tracks(track).then(async function (result) {
        let items = result.data;
        let songsarray = [];
        let tracklength = items.length;

        functions.embedbuilder(client, 5000, message, config.colors.yes, "🎶  Fetching the songs!", "This will take me around about: " + tracklength / 2 + " seconds");
        
        for (let i = 0; i < 25; i++) {
          let result = await client.distube.play(items[i].title);
          songsarray.push(result[0].url)
        }
        client.distube.playCustomPlaylist(message, songsarray, {
          name: message.author.username + "'s Deezer Playlist"
        });
      });
    } 

    //do things for spotify track
    else if (args.join(" ").includes("track") && args.join(" ").includes("open.spotify")) {
      //get data
      let info = await getPreview(args.join(" "));
      //play track
      return client.distube.play(message, info.artist + " " + info.title);
    } 

    //do things for spotify playlist
    else if (args.join(" ").includes("playlist") && args.join(" ").includes("open.spotify")) {
      let items = await getTracks(args.join(" "));
      let songsarray = [];
      let tracklength = items.length;
      if (tracklength > 25) {
        message.reply("the current maximum of tracks for spotify playlists are 25 tracks, if you wanna use bigger playlists, then dm `Tomato#6966`\n\nI will use the first 25 songs!");
        tracklength = 25;
      }
      functions.embedbuilder(client, 5000, message, config.colors.yes, "🎶  Fetching the songs!", "This will take me around about: " + tracklength / 2 + " seconds");
      for (let i = 0; i < 25; i++) {
        let result = await client.distube.play(items[i].title);
        songsarray.push(result[0].url)
      }
      client.distube.playCustomPlaylist(message, songsarray, {
        name: message.author.username + "'s Spotify Playlist"
      });
    } 

    //just play it
    else {
      return client.distube.play(message, args.join(" "));
    }
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
