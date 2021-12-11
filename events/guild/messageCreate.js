//Import Modules
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const {
  onCoolDown,
  replacemsg
} = require(`../../handlers/functions`);
const Discord = require(`discord.js`);
module.exports = async (client, message) => {
  if (!message.guild || !message.channel || message.author.bot) return;
  if (message.channel.partial) await message.channel.fetch();
  if (message.partial) await message.fetch();
  client.settings.ensure(message.guild.id, {
    prefix: config.prefix,
    defaultvolume: 50,
    autoresume: true,
    defaultautoplay: false,
    defaultfilters: [`bassboost6`, `clear`],
    djroles: [],
    botchannel: [],
    music: {
      channel: ``,
      message: ``,
    }
  })
  let prefix = client.settings.get(message.guild.id, `prefix`)
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})`);
  if (!prefixRegex.test(message.content)) return;
  const [, mPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(mPrefix.length).trim().split(/ +/).filter(Boolean);
  const cmd = args.length > 0 ? args.shift().toLowerCase() : null;
  if (!cmd || cmd.length == 0) {
    if (mPrefix.includes(client.user.id)) {
      message.reply({
        embeds: [new Discord.MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon).setTitle(`:thumbsup: **My Prefix here, is __\`${prefix}\`__**`)]
      })
    }
    return;
  }
  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if (command) {
    if(client.settings.get(message.guild.id, "music.channels") === message.channel.id) 
    return message.reply(`${client.allEmojis.x} **Please use a Command Somewhere else!**`).then(msg=>{setTimeout(()=>{try{msg.delete().catch(() => {});}catch(e){ }}, 3000)}).catch(() => {});
    let botchannels = client.settings.get(message.guild.id, `botchannel`);
    if (!botchannels || !Array.isArray(botchannels)) botchannels = [];
    if (botchannels.length > 0) {
      if (!botchannels.includes(message.channel.id) && !message.member.permissions.has("ADMINISTRATOR")) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **You are not allowed to use this Command in here!**`)
            .setDescription(`Please do it in one of those:\n> ${botchannels.map(c=>`<#${c}>`).join(", ")}`)
          ]
        })
      }
    }
    //Check if user is on cooldown with the cmd, with Tomato#6966's Function from /handlers/functions.js
    if (onCoolDown(message, command)) {
      return message.reply({
        embeds: [new Discord.MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(replacemsg(settings.messages.cooldown, {
            prefix: prefix,
            command: command,
            timeLeft: onCoolDown(message, command)
          }))
        ]
      });
    }
    try {
      //if Command has specific permission return error
      if (command.memberpermissions && command.memberpermissions.length > 0 && !message.member.permissions.has(command.memberpermissions)) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
            .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.memberpermissions, {
              command: command,
              prefix: prefix
            }))
          ]
        }).then(msg => {
          setTimeout(() => {
            msg.delete().catch((e) => {
              console.log(String(e).grey)
            })
          }, settings.timeout.notallowed_to_exec_cmd.memberpermissions)
        }).catch((e) => {
          console.log(String(e).grey)
        });
      }
      //if Command has specific needed roles return error
      if (command.requiredroles && command.requiredroles.length > 0 && message.member.roles.cache.size > 0 && !message.member.roles.cache.some(r => command.requiredroles.includes(r.id))) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
            .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.requiredroles, {
              command: command,
              prefix: prefix
            }))
          ]
        }).then(msg => {
          setTimeout(() => {
            msg.delete().catch((e) => {
              console.log(String(e).grey)
            })
          }, settings.timeout.notallowed_to_exec_cmd.requiredroles)
        }).catch((e) => {
          console.log(String(e).grey)
        });

      }
      //if Command has specific users return error
      if (command.alloweduserids && command.alloweduserids.length > 0 && !command.alloweduserids.includes(message.author.id)) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
            .setDescription(replacemsg(settings.messages.notallowed_to_exec_cmd.description.alloweduserids, {
              command: command,
              prefix: prefix
            }))
          ]
        }).then(msg => {
          setTimeout(() => {
            msg.delete().catch((e) => {
              console.log(String(e).grey)
            })
          }, settings.timeout.notallowed_to_exec_cmd.alloweduserids)
        }).catch((e) => {
          console.log(String(e).grey)
        });
      }
      //if command has minimum args, and user dont entered enough, return error
      if (command.minargs && command.minargs > 0 && args.length < command.minargs) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} Wrong Command Usage!`)
            .setDescription(command.argsmissing_message && command.argsmissing_message.trim().length > 0 ? command.argsmissing_message : command.usage ? `Usage: ` + command.usage : `Wrong Command Usage`)
          ]
        }).then(msg => {
          setTimeout(() => {
            msg.delete().catch((e) => {
              console.log(String(e).grey)
            })
          }, settings.timeout.minargs)
        }).catch((e) => {
          console.log(String(e).grey)
        });
      }
      //if command has maximum args, and user enters too many, return error
      if (command.maxargs && command.maxargs > 0 && args.length > command.maxargs) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} Wrong Command Usage!`)
            .setDescription(command.argstoomany_message && command.argstoomany_message.trim().length > 0 ? command.argstoomany_message : command.usage ? `Usage: ` + command.usage : `Wrong Command Usage`)
          ]
        }).then(msg => {
          setTimeout(() => {
            msg.delete().catch((e) => {
              console.log(String(e).grey)
            })
          }, settings.timeout.maxargs)
        }).catch((e) => {
          console.log(String(e).grey)
        });
      }

      //if command has minimum args (splitted with `++`), and user dont entered enough, return error
      if (command.minplusargs && command.minplusargs > 0 && args.join(` `).split(`++`).filter(Boolean).length < command.minplusargs) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} Wrong Command Usage!`)
            .setDescription(command.argsmissing_message && command.argsmissing_message.trim().length > 0 ? command.argsmissing_message : command.usage ? `Usage: ` + command.usage : `Wrong Command Usage`)
          ]
        }).then(msg => {
          setTimeout(() => {
            msg.delete().catch((e) => {
              console.log(String(e).grey)
            })
          }, settings.timeout.minplusargs)
        }).catch((e) => {
          console.log(String(e).grey)
        });
      }
      //if command has maximum args (splitted with `++`), and user enters too many, return error
      if (command.maxplusargs && command.maxplusargs > 0 && args.join(` `).split(`++`).filter(Boolean).length > command.maxplusargs) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} Wrong Command Usage!`)
            .setDescription(command.argstoomany_message && command.argstoomany_message.trim().length > 0 ? command.argsmissing_message : command.usage ? `Usage: ` + command.usage : `Wrong Command Usage`)
          ]
        }).then(msg => {
          setTimeout(() => {
            msg.delete().catch((e) => {
              console.log(String(e).grey)
            })
          }, settings.timeout.maxplusargs)
        }).catch((e) => {
          console.log(String(e).grey)
        });
      }
      //run the command with the parameters:  client, message, args, Cmduser, text, prefix,
      command.run(client, message, args, args.join(` `).split(`++`).filter(Boolean), message.member, args.join(` `), prefix);
    } catch (error) {
      if (settings.somethingwentwrong_cmd) {
        return message.reply({
          embeds: [new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(replacemsg(settings.messages.somethingwentwrong_cmd.title, {
              prefix: prefix,
              command: command
            }))
            .setDescription(replacemsg(settings.messages.somethingwentwrong_cmd.description, {
              error: error,
              prefix: prefix,
              command: command
            }))
          ]
        }).then(msg => {
          setTimeout(() => {
            msg.delete().catch((e) => {
              console.log(String(e).grey)
            })
          }, 4000)
        }).catch((e) => {
          console.log(String(e).grey)
        });
      }
    }
  }
  /* else //if the command is not found send an info msg
          return message.reply({
            embeds: [new Discord.MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(replacemsg(settings.messages.unknown_cmd, {
                prefix: prefix
              }))]
          }).then(msg => {setTimeout(()=>{msg.delete().catch((e) => {console.log(String(e).grey)})}, 4000)}).catch((e) => {console.log(String(e).grey)});*/
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch {
    return str
  }
}
