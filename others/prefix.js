const { Client, Collection, MessageEmbed } = require(`discord.js`);
const {
  PREFIX,
  approveemoji,
  denyemoji
} = require(`../config.json`);

const db = require('quick.db');


module.exports = {
  name: `prefix`,
  description: `Sets a server specific Prefix`,
  aliases: ["setprefix"],
  cooldown: 3,
  edesc: `Type this Command, to set a server specific Prefix! Usage: ${PREFIX}prefix <NEW PREFIX>`,
 async execute(message, args, client) {
    
    let prefix = await db.get(`prefix_${message.guild.id}`)
    if(prefix === null) prefix = PREFIX;

    if(!message.member.hasPermission("MANAGE_SERVER")) return message.channel.send('You don\'t have permission to use that.');

    if(!args[0]) return message.channel.send(new MessageEmbed()
    .setColor("#c219d8")
    .setTitle(`Current Prefix: \`${prefix}\``)
    .setFooter('Please provide a new prefix')
    );

    if(args[1]) return message.channel.send(new MessageEmbed()
    .setColor("#c219d8")
    .setTitle(`'<:no:770326304473350145> The prefix can\'t have two spaces'`));

    db.set(`prefix_${message.guild.id}`, args[0])

    message.channel.send(new MessageEmbed()
    .setColor("#c219d8")
    .setTitle(`<:CHECKMARK:770290491731476500> Successfully set new prefix to **\`${args[0]}\`**`))
  }
} 
