const { Client, Collection, MessageEmbed } = require(`discord.js`);
const {
  PREFIX,
  approveemoji,
  denyemoji
} = require(`../config.json`);

module.exports = {
  name: `botlist`,
  description: `Gives you the botlists of the Bot`,
  aliases: [],
  cooldown: 3,
  edesc: "Type this command to view all Bot list Server where the bot is on. Please vote there UwU",
  execute(message, args, client) {
    //react with approve emoji
    message.react("769665713124016128");
    //send the botlist embed
    message.reply(new MessageEmbed().setColor("#c219d8")
    .setTitle("Here is a list for all Bot-Lists this Bot is on!")
    .addField("Matrixbots","https://www.matrixbots.xyz/bots/769642999227351070/")
    .addField("top.gg", "https://top.gg/bot/769642999227351070")
    .addField("bots.ondiscord","https://bots.ondiscord.xyz/bots/769642999227351070")
    .addField("discordbotlist","https://discordbotlist.com/bots/musicium")
    );

  }
}
