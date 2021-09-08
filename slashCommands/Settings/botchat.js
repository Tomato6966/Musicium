const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
  name: "botchat", //the command name for execution & for helpcmd [OPTIONAL]
  cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: "Manages the Bot-Chats!", //the command description for helpcmd [OPTIONAL]
  memberpermissions: ["MANAGE_GUILD "], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    //{"Integer": { name: "volume", description: "Volume Amount between 1 & 150!", required: true }}, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    {
      "StringChoices": {
        name: "what_to_do",
        description: "What do you want to do?",
        required: true,
        choices: [
          ["Add Whitelisted Bot-Chat", "add"],
          ["Remove Whitelisted Bot-Chat", "remove"],
        ]
      }
    }, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
    {
      "Channel": {
        name: "which_channel",
        description: "Which Channel do you want to add/Remove",
        required: true
      }
    }, //to use in the code: interacton.getRole("what_role")
  ],
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
      let add_remove = options.getString("what_to_do");
      let Channel = options.getChannel("which_channel");
      client.settings.ensure(guild.id, {
        botchannel: []
      });
      if (add_remove == "add") {
        if (client.settings.get(guild.id, "botchannel").includes(Channel.id)) {
          return interaction.reply({
            ephemeral: true,
            embeds: [
              new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`${client.allEmojis.x} **This Channel is already a whitelisted Bot-Channel!**`)
            ],
          })
        }
        client.settings.push(guild.id, Channel.id, "botchannel");
        var djs = client.settings.get(guild.id, `botchannel`).map(r => `<#${r}>`);
        if (djs.length == 0) djs = "`not setup`";
        else djs.join(", ");
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.check_mark} **The Channel \`${Channel.name}\` got added to the ${client.settings.get(guild.id, "djroles").length - 1} whitelisted Bot-Channels!**`)
            .addField(`🎧 **Bot-Channel${client.settings.get(guild.id, "botchannel").length > 1 ? "s": ""}:**`, `>>> ${djs}`, true)
          ],
        })
      } else {
        if (!client.settings.get(guild.id, "botchannel").includes(Channel.id)) {
          return interaction.reply({
            ephemeral: true,
            embeds: [
              new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`${client.allEmojis.x} **This Channel is not a whitelisted Bot-Channel yet!**`)
            ],
          })
        }
        client.settings.remove(guild.id, Channel.id, "botchannel");
        var djs = client.settings.get(guild.id, `botchannel`).map(r => `<#${r}>`);
        if (djs.length == 0) djs = "`not setup`";
        else djs.join(", ");
        return interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed()
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.check_mark} **The Channel \`${Channel.name}\` got removed from the ${client.settings.get(guild.id, "djroles").length} whitelisted Bot-Channels!**`)
            .addField(`🎧 **Bot-Channel${client.settings.get(guild.id, "botchannel").length > 1 ? "s": ""}:**`, `>>> ${djs}`, true)
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
