const functions = require("../../functions")
const config = require("../../config.json")
//CHARTS
let {
  playlist1,
  playlist2,
  playlist3,
  playlist4,
  playlist5,
  playlist6
} = require("../../playlists.json")
module.exports = {
  name: "playlist",
  category: "MUSIC COMMANDS",
  aliases: ["botpl", "botplaylist", "pl"],
  useage: "playlist <Playlist Number>",
  description: "Play some premade GOOD Playlists!",

  run: async (client, message, args) => {

    if (args[0]) {
      switch (args[0].toLowerCase()) {
        case "1":
          functions.embedbuilder(client, "null", message, config.colors.yes, "Loading");
          return client.distube.playCustomPlaylist(message, playlist1, {
            name: "Charts playlist"
          });
          break;
        case "charts":
          functions.embedbuilder(client, "null", message, config.colors.yes, "Loading");
          return client.distube.playCustomPlaylist(message, playlist1, {
            name: "Charts playlist"
          });
          break;

        case "2":
          functions.embedbuilder(client, "null", message, config.colors.yes, "Loading");
          return client.distube.playCustomPlaylist(message, playlist2, {
            name: "Christmas playlist"
          });
          break;
        case "christmas":
          functions.embedbuilder(client, "null", message, config.colors.yes, "Loading");
          return client.distube.playCustomPlaylist(message, playlist2, {
            name: "Christmas playlist"
          });
          break;

        case "3":
          functions.embedbuilder(client, "null", message, config.colors.yes, "Loading");
          return client.distube.playCustomPlaylist(message, playlist3, {
            name: "Jazz playlist"
          });
          break;
        case "jazz":
          functions.embedbuilder(client, "null", message, config.colors.yes, "Loading");
          return client.distube.playCustomPlaylist(message, playlist3, {
            name: "Jazz playlist"
          });
          break;

        case "4":
          functions.embedbuilder(client, "null", message, config.colors.yes, "Loading");
          return client.distube.playCustomPlaylist(message, playlist4, {
            name: "Blues playlist"
          });
          break;
        case "blues":
          functions.embedbuilder(client, "null", message, config.colors.yes, "Loading");
          return client.distube.playCustomPlaylist(message, playlist4, {
            name: "Blues playlist"
          });
          break;

        case "5":
          functions.embedbuilder(client, "null", message, config.colors.yes, "Loading");
          return client.distube.playCustomPlaylist(message, playlist5, {
            name: "Country playlist"
          });
          break;
        case "country":
          functions.embedbuilder(client, "null", message, config.colors.yes, "Loading");
          return client.distube.playCustomPlaylist(message, playlist5, {
            name: "Country playlist"
          });
          break;

        case "6":
          functions.embedbuilder(client, "null", message, config.colors.yes, "Loading");
          return client.distube.playCustomPlaylist(message, playlist6, {
            name: "Rock playlist"
          });
          break;
        case "rock":
          functions.embedbuilder(client, "null", message, config.colors.yes, "Loading");
          return client.distube.playCustomPlaylist(message, playlist6, {
            name: "Rock playlist"
          });
          break;

        default:
          functions.embedbuilder(client, "null", message, config.colors.no, `Available Playlists:`, "1. Charts\n2. Christmas\n3. Jazz\n4. Blues\n5. Country\n6. Rock")
          return functions.embedbuilder(client, "null", message, config.colors.no, `Command Syntax:`, "+botplaylist <Playlist Number>")
          break;
      }
    } else {
      functions.embedbuilder(client, "null", message, config.colors.no, `Available Playlists:`, "1. Charts\n2. Christmas\n3. Jazz\n4. Blues\n5. Country\n6. Rock")
      return functions.embedbuilder(client, "null", message, config.colors.no, `Command Syntax:`, "+botplaylist <Playlist Number>")
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
