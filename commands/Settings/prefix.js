const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "prefix", //the command name for execution & for helpcmd [OPTIONAL]
  category: "Settings",
  aliases: ["setprefix"],
  usage: "prefix <newPrefix>",
  cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: "Changes the Prefix of the Bot!", //the command description for helpcmd [OPTIONAL]
  memberpermissions: ["MANAGE_GUILD "], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]

  run: async (client, message, args) => {
    try {
      //things u can directly access in an interaction!
      const {
        member,
      } = message;
      const {
        guild
      } = member;
      if (!args[0]) {
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **Please add a Prefix!**`)
            .setDescription(`**Usage:**\n> \`${client.settings.get(guild.id, "prefix")}prefix <newPrefix>\``)
          ],
        })
      }
      let newPrefix = args[0];

      client.settings.set(guild.id, newPrefix, "prefix");
      return message.reply({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${client.allEmojis.check_mark} **The new Prefix is now: \`${newPrefix}\`**`)
        ],
      })
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
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
