const functions = require("../../functions")
const config = require("../../config.json")
module.exports = {
  name: "removedj",
  aliases: ["deletedj"],
  category: "setup commands",
  description: "Let's you DELETE a DJ ROLE",
  useage: "removedj @ROLE",
  run: async (client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return functions.embedbuilder(client, "null", message, config.colors.no, "DISABLE-DJ-ROLES-SETUP", `❌ You don\'t have permission for this Command!`)
    let role = message.mentions.roles.first();
    if (!role) return functions.embedbuilder(client, "null", message, config.colors.no, `ERROR`, `Please add a Channel via ping, for example: #channel!`)
    try {
      message.guild.roles.cache.get(role.id)
    } catch {
      return functions.embedbuilder(client, "null", message, config.colors.no, `ERROR`, `It seems that the Channel does not exist in this Server!`)
    }

    if (!client.settings.get(message.guild.id, `djroles`).includes(role.id)) return functions.embedbuilder(client, "null", message, config.colors.no, `ERROR`, `This Role is already a DJ-ROLE!`)
    message.react("✅");
    client.settings.remove(message.guild.id, role.id, `djroles`);

    let leftb = "";
    if (client.settings.get(message.guild.id, `djroles`).join("") === "") leftb = "no Dj Roles, aka All Users are Djs"
    else
      for (let i = 0; i < client.settings.get(message.guild.id, `djroles`).length; i++) {
        leftb += "<@&" + client.settings.get(message.guild.id, `djroles`)[i] + "> | "
      }
    return functions.embedbuilder(client, "null", message, config.colors.yes, "DJ-ROLES-SETUP", `✅ Successfully deleted ${role} from this Server-DJ-Roles
    left DJ-ROLES:
    > ${leftb}
    `)
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
