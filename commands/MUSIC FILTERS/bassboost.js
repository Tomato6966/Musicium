const functions = require("../../functions")
const config = require("../../config.json")
const path = require("path");
module.exports = {

  name: path.parse(__filename).name,
  category: "MUSIC FILTERS",
  useage: `<${path.parse(__filename).name}>`,
  description: "*Adds a Filter named " + path.parse(__filename).name,
  run: async (client, message, args) => {
    //if not a dj, return error
    if (functions.check_if_dj(message))
      return functions.embedbuilder(client, 6000, message, config.colors.no, "DJ-ROLE", `<:declined:780403017160982538> You don\'t have permission for this Command! You need to have: ${functions.check_if_dj(message)}`)

    //If Bot not connected, return error
    if (!message.guild.me.voice.channel) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")

    //if member not connected return error
    if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")

    //if they are not in the same channel, return error
    if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)

    //get queue
    let queue = client.distube.getQueue(message);

    //if no queue return error
    if (!queue) return functions.embedbuilder(client, 3000, message, config.colors.no, "There is nothing playing!");
    let filter = message.content.slice(config.prefix.length).split(" ")[0];
    if (args[0]) {
      let bassboostfilter = `bassboost${Math.floor(Number(args[0]))}`;
      switch (Math.floor(Number(args[0]))) {
        case 1:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 2:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 3:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 4:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 5:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 6:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 7:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 8:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 9:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 10:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 11:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 12:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 13:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 14:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 15:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 16:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 17:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 18:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 19:
          await client.distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          break;

        case 20:

          await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``)
          await client.distube.setFilter(message, bassboostfilter);
          break;

        default:
          await functions.embedbuilder(client, 3000, message, config.colors.no, "ERROR", `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\` DOES NOT WORK!`)
          break;
      }
    } else if (message.content.slice(config.prefix.length).split(" ")[0] === queue.filter) filter = "clear";
    else {
      filter = await client.distube.setFilter(message, filter);
      await functions.embedbuilder(client, 3000, message, config.colors.yes, "Adding filter!", filter)
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
