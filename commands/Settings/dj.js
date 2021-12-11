const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "dj", //the command name for execution & for helpcmd [OPTIONAL]

  category: "Settings",
  aliases: ["djrole", "role", "drole", "djs", "dj-role"],
  usage: "dj <add/remove> <@Role>",

  cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: "Manages the Djs!", //the command description for helpcmd [OPTIONAL]
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
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **Please add a __Method+Role__!**`)
            .setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}dj <add/remove> <@Role>\``)
          ],
        });
      }
      let add_remove = args[0].toLowerCase();
      if (!["add", "remove"].includes(add_remove)) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **Please add a __valid Method__+Role!**`)
            .setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}dj <add/remove> <@Role>\``)
          ],
        });
      }
      let Role = message.mentions.roles.first();
      if (!Role) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **Please add a Method+__Role__!**`)
            .setDescription(`**Usage:**\n> \`${client.settings.get(message.guild.id, "prefix")}dj <add/remove> <@Role>\``)
          ],
        });
      }
      if (add_remove == "add") {
        if (client.settings.get(guild.id, "djroles").includes(Role.id)) {
          return message.reply({
            embeds: [
              new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`${client.allEmojis.x} **This Role is already a DJ-ROLE!**`)
            ],
          })
        }
        client.settings.push(guild.id, Role.id, "djroles");
        var djs = client.settings.get(guild.id, `djroles`).map(r => `<@&${r}>`);
        if (djs.length == 0) djs = "`not setup`";
        else djs.join(", ");
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.check_mark} **The Role \`${Role.name}\` got added to the ${client.settings.get(guild.id, "djroles").length - 1} DJ-Roles!**`)
            .addField(`🎧 **DJ-Role${client.settings.get(guild.id, "djroles").length > 1 ? "s": ""}:**`, `>>> ${djs}`, true)
          ],
        })
      } else {
        if (!client.settings.get(guild.id, "djroles").includes(Role.id)) {
          return message.reply({
            embeds: [
              new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`${client.allEmojis.x} **This Role is not a DJ-ROLE yet!**`)
            ],
          })
        }
        client.settings.remove(guild.id, Role.id, "djroles");
        var djs = client.settings.get(guild.id, `djroles`).map(r => `<@&${r}>`);
        if (djs.length == 0) djs = "`not setup`";
        else djs.join(", ");
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.check_mark} **The Role \`${Role.name}\` got removed from the ${client.settings.get(guild.id, "djroles").length} DJ-Roles!**`)
            .addField(`🎧 **DJ-Role${client.settings.get(guild.id, "djroles").length > 1 ? "s": ""}:**`, `>>> ${djs}`, true)
          ],
        })
      }

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
