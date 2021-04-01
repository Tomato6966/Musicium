const functions = require("../../functions")
const config = require("../../config.json")
module.exports = {
  name: "queue",
  category: "Music",
  aliases: ["qu"],
  cooldown: 4,
  useage: "queue",
  description: "Shows the current Queue of Track",
  run: async (client, message, args, cmduser, text, prefix) => {
      //if not a dj, return error - DISABLED CAUSE NOT NEEDED
      //if (functions.check_if_dj(message))
      //    return functions.embedbuilder(client, 6000, message, config.colors.no, "DJ-ROLE", `❌ You don\'t have permission for this Command! You need to have: ${functions.check_if_dj(message)}`)

      //If Bot not connected, return error
      if (!message.guild.me.voice.channel) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")

      //if member not connected return error
      if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")

      //if they are not in the same channel, return error
      if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)

      //get the queue
      let queue = client.distube.getQueue(message);

      //if no queue return error
      if (!queue) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")
       
      let currentPage = 0;
      const embeds = functions.QueueEmbed(client, queue)

      const queueEmbed = await message.channel.send(
          `**Current Page - ${currentPage + 1}/${embeds.length}**`,
          embeds[currentPage]
      );

      try {
          await queueEmbed.react("⬅️");
          await queueEmbed.react("➡️");
          await queueEmbed.react("⏹");
      } catch (error) {
          console.error(error);
          functions.embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
          functions.errorbuilder(error.stack.toString().substr(0, 2000))
      }

      const filter = (reaction, user) => ["⬅️", "⏹", "➡️"].includes(reaction.emoji.id || reaction.emoji.name) && message.author.id === user.id;
      const collector = queueEmbed.createReactionCollector(filter, {
          time: 60000
      });

      collector.on("collect", async (reaction, user) => {
          try {
              if (reaction.emoji.id === "➡️" || reaction.emoji.name === "➡️") {
                  if (currentPage < embeds.length - 1) {
                      currentPage++;
                      queueEmbed.edit(`**Current Page - ${currentPage + 1}/${embeds.length}**`, embeds[currentPage]);
                  }
              } else if (reaction.emoji.id === "➡️" || reaction.emoji.name === "⬅️") {
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
              functions.embedbuilder(client, 5000, message, config.colors.no, "ERROR: ", "```" + error.toString().substr(0, 100) + "```" + "\n\n**Error got sent to my owner!**")
              functions.errorbuilder(error.stack.toString().substr(0, 2000))
          }
      });

  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
