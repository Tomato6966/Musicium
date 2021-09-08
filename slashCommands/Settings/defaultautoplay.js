const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "defaultautoplay", //the command name for execution & for helpcmd [OPTIONAL]
  cooldown: 10, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: "Defines if Autoplay should be enabled on default or not!", //the command description for helpcmd [OPTIONAL]
  memberpermissions: ["MANAGE_GUILD "], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, interaction) => {
    try {
      //things u can directly access in an interaction!
      const {
        member,
        channelId,
        guildId,
        applicationId,
        commandName,
        deferred,
        replied,
        ephemeral,
        options,
        id,
        createdTimestamp
      } = interaction;
      const {
        guild
      } = member;
      client.settings.ensure(guild.id, {
        defaultvolume: 50,
        defaultautoplay: false,
        defaultfilters: [`bassboost6`, `clear`]
      });

      client.settings.set(guild.id, !client.settings.get(guild.id, "defaultautoplay"), "defaultautoplay");
      return interaction.reply({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${client.allEmojis.check_mark} **The Default-Autoplay got __\`${client.settings.get(guild.id, "defaultautoplay") ? "Enabled" : "Disabled"}\`__!**`)
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
