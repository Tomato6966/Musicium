const functions = require("../../functions")
const config = require("../../config.json")
module.exports = {
  name: "addbotchat",
  aliases: ["addbotchannel"],
  category: "setup commands",
  description: "Let's you enable a bot only chat where the community is allowed to use commands",
  useage: "addbotchat <#chat>",
  run: async (client, message, args) => {
    //command
    if (!message.member.hasPermission("ADMINISTRATOR")) return functions.embedbuilder(client, "null", message, config.colors.no, "BOT-CHAT-SETUP", `❌ You don\'t have permission for this Command!`)

    let channel = message.mentions.channels.first();
    if (!channel) return functions.embedbuilder(client, "null", message, config.colors.no, `ERROR`, `Please add a Channel via ping, for example: #channel!`)
    try {
      message.guild.roles.cache.get(channel.id)
    } catch {
      return functions.embedbuilder(client, "null", message, config.colors.no, `ERROR`, `It seems that the Channel does not exist in this Server!`)
    }
    if (client.settings.get(message.guild.id, `botchannel`).includes(channel.id)) return functions.embedbuilder(client, "null", message, config.colors.no, `ERROR`, `This Channel is alerady in the List!`)

    message.react("✅");

    client.settings.push(message.guild.id, channel.id, `botchannel`);
    let leftb = "";
    if (client.settings.get(message.guild.id, `botchannel`).join("") === "") leftb = "no Channels, aka all Channels are Bot Channels"
    else
      for (let i = 0; i < client.settings.get(message.guild.id, `botchannel`).length; i++) {
        leftb += "<#" + client.settings.get(message.guild.id, `botchannel`)[i] + "> | "
      }
    let botchatfromenmap = message.guild.channels.cache.get(client.settings.get(message.guild.id, `botchannel`)[client.settings.get(message.guild.id, `botchannel`).length])

    return functions.embedbuilder(client, "null", message, config.colors.yes, "BOT-CHAT-SETUP ", `✅ Successfully added the Bot-Chat to ${botchatfromenmap}
  All Bot Chats:
  > ${leftb}`)

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
