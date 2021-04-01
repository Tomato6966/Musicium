const functions = require("../../functions")
const config = require("../../config.json")
module.exports = {
  name: "mycustom",
  category: "MUSIC COMMANDS",
  aliases: [""],
  useage: "mycustom <add/remove/play/reset> [LINK]",
  description: "Add / Remove / Play a Custom created playlist!",

  run: async (client, message, args) => {


    let playlist = client.custom2.get(message.author.id, "myplaylists");
    if (args[0] === "add" || args[0] === "set" || args[0] === "use") {
      if (!args[1].includes("http")) return message.reply("Oh no! That is not a Link for example: https://www.youtube.com/watch?v=dQw4w9WgXcQ")
      if (playlist.includes(args[1])) return message.reply("Oh no! The Song is already existing in the Server Playlist, NO DOUBLE SONGS!")
      client.custom2.push(message.author.id, args[1], "myplaylists");
      return functions.embedbuilder(client, 5000, message, config.colors.yes, "SUCCESSFULLY ADDED A SONG TO THE SERVER PLAYLIST" + `
      There are now: \`${playlist.length+1}\` songs in the Server playlist`)
    }
    if (args[0] === "reset" || args[0] === "res") {
      let themsg = await message.reply("Do you really want to reset your custom playlist? ||(*Reply with:* **__`yes`__**)||")
      const filter = m => m.author.id === message.author.id;
      themsg.channel.awaitMessages(filter, {
          max: 1,
          time: 600000,
          errors: ['time']
        })
        .then(async collected => {
          if (collected === "yes") {
            try {
              await client.custom2.delete(message.author.id, "myplaylists");
            } catch {
              /* */
            }
            client.custom2.ensure(message.author.id, {
              myplaylists: [],
            });
            await message.reply("SUCCESSFULLY RESETTED YOUR CUSTOM PLAYLIST")
          }
        }).catch(error => {
          message.reply("CANCELLED CAUSE NOT THE RIGHT WORD / TIME RAN OUT!")
        })
    }
    if (args[0] === "play" || args[0] === "p" || args[0] === "hear" || args[0] === "listen") {
      client.distube.playCustomPlaylist(message, playlist, {
        name: message.author.username + "'s Playlist"
      });
      return functions.embedbuilder(client, 5000, message, config.colors.yes, "PLAYING CUSTOM PLAYLIST")
    }
    if (args[0] === "remove" || args[0] === "delete" || args[0] === "del" || args[0] === "rem") {
      if (!args[1]) return message.reply("Please add a song link what you want to add, thanks!");
      if (!playlist.includes(args[1])) return message.reply("Oh no! The Song is not existing, in the Server playlist, make sure it is the same link!")

      client.custom2.remove(message.author.id, args[1], "myplaylists");
      return functions.embedbuilder(client, 5000, message, config.colors.yes, "SUCCESSFULLY REMOVED THE SONG FROM YOUR PLAYLIST")
    } else {
      let string = playlist.join("\n");
      customplay(message, string, playlist)
      functions.embedbuilder(client, "null", message, config.colors.yes, `There are ${playlist.length} Songs in your Playlist!`, )
      return functions.embedbuilder(client, "null", message, config.colors.yes, `Command Syntax:`, "+mycustom <add/remove/play> [Link]")
    }
  }
};
async function customplay(message, string, cursong) {
  let currentPage = 0;
  const embeds = functions.customplaylistembed(client, message, string, cursong);

  const queueEmbed = await message.channel.send(
    `**Current Page - ${currentPage + 1}/${embeds.length}**`,
    embeds[currentPage]
  );

  try {
    await queueEmbed.react("⬅️");
    await queueEmbed.react("⏹");
    await queueEmbed.react("➡️");
  } catch (error) {
    console.error(error);
    functions.embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
    functions.errorbuilder(error.stack.toString().substr(0, 1000))
  }

  const filter = (reaction, user) => ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name) && message.author.id === user.id;
  const collector = queueEmbed.createReactionCollector(filter, {
    time: 60000
  });

  collector.on("collect", async (reaction, user) => {
    try {
      if (reaction.emoji.name === "⬅️") {
        if (currentPage < embeds.length - 1) {
          currentPage++;
          queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
        }
      } else if (reaction.emoji.name === "➡️") {
        if (currentPage !== 0) {
          --currentPage;
          queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
        }
      } else {
        collector.stop();
        reaction.message.reactions.removeAll();
      }
      await reaction.users.remove(message.author.id);
    } catch (error) {
      console.error(error);
      functions.embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
      functions.errorbuilder(error.stack.toString().substr(0, 2000))
    }
  });

}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
