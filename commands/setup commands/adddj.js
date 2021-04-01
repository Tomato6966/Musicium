const functions = require("../../functions")
const config = require("../../config.json")
module.exports = {
  name: "adddj",
  aliases: ["adddjrole"],
  category: "setup commands",
  description: "Let's you define a DJ ROLE (as an array, aka you can have multiple)",
  useage: "adddj @role",
  run: async (client, message, args) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return functions.embedbuilder(client, "null", message, config.colors.no, "DJ-ROLE", `❌ You don\'t have permission for this Command!`)

    let role = message.mentions.roles.first();

    try {
      message.guild.roles.cache.get(role.id)
    } catch {
      return functions.embedbuilder(client, "null", message, config.colors.no, `ERROR`, `It seems that the Role does not exist in this Server!`)
    }

    if (!role) return functions.embedbuilder(client, "null", message, config.colors.no, `ERROR`, `Please add a Role via ping, @role!`)
    if (client.settings.get(message.guild.id, `djroles`).includes(role.id)) return functions.embedbuilder(client, "null", message, config.colors.no, `ERROR`, `This Role is alerady in the List!`)

    message.react("✅");

    client.settings.push(message.guild.id, role.id, `djroles`);
    let leftb = "";
    if (client.settings.get(message.guild.id, `djroles`).join("") === "") leftb = "no Dj Roles, aka All Users are Djs"
    else
      for (let i = 0; i < client.settings.get(message.guild.id, `djroles`).length; i++) {
        leftb += "<@&" + client.settings.get(message.guild.id, `djroles`)[i] + "> | "
      }

    return functions.embedbuilder(client, "null", message, config.colors.yes, "DJ-ROLE", `✅ Successfully set the DJ ROLE to ${role}
    All Dj Roles:
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
