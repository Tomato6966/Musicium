const {
  MessageEmbed,
  Util: {
    splitMessage
  },
} = require(`discord.js`);
const ee = require("../../botconfig/embed.json")
const {
  inspect
} = require(`util`);
module.exports = {
  name: `eval`,
  category: `Settings`,
  aliases: [`evaluate`],
  description: `eval Command`,
  usage: `eval <CODE>`,
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix) => {
    if (!["442355791412854784"].includes(message.author.id))
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(message.guild.name, message.guild.iconURL({
            dynamic: true
          }))
          .setTitle(`${client.allEmojis.x} Only \`Tomato#6966\` is allowed to execute this Code`)
        ]
      });
    if (!args[0])
      return message.channel.send({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(message.guild.name, message.guild.iconURL({
            dynamic: true
          }))
          .setTitle(`${client.allEmojis.x} Please add the Code to evaluate`)
        ]
      });
    const token = client.token.split("").join("[^]{0,2}");
    const rev = client.token.split("").reverse().join("[^]{0,2}");
    const filter = new RegExp(`${token}|${rev}`, "g");
    let output = await eval(args.join(` `));
    if (output instanceof Promise || (Boolean(output) && typeof output.then === "function" && typeof output.catch === "function")) output = await output;
    //make string out of the evaluation
    output = inspect(output, { depth: 0, maxArrayLength: null });
    //replace with the token
    output = output.replace(filter, "**\\*\\*\\*\\*\\*\\*\\*\\*T\\*O\\*K\\*E\\*N\\*\\*\\*\\*\\*\\*\\*\\***");
    let string = output;
    //if the token is included return error
    //if (string.includes(client.token)) return console.log(`ERROR NO TOKEN GRABBING ;)`.dim);
    //define queueembed
    let evalEmbed = new MessageEmbed()
    .setTitle(`Evaluation`)
      .setColor(ee.color);
    //split the description
    const splitDescription = splitMessage(string, {
      maxLength: 2040,
      char: `\n`,
      prepend: ``,
      append: ``
    });
    //(over)write embed description
    evalEmbed.setDescription(`\`\`\`${splitDescription[0]}\`\`\``);
    //send embed
    message.channel.send({
      embeds: [evalEmbed]
    });
  },
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
