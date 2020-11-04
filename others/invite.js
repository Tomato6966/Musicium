const { Client, Collection, MessageEmbed } = require(`discord.js`);
const {
  PREFIX,
  approveemoji,
  denyemoji
} = require(`../config.json`);

module.exports = {
  name: `invite`,
  description: `Gives you an invite`,
  aliases: ["add"],
  cooldown: 3,
  edesc: "Type this command to get an invite link for the Bot, thanks for every Invite",
  execute(message, args, client) {
    //react with approve emoji
    message.react("769665713124016128");
    //send the invite embed
    message.reply(new MessageEmbed().setColor("#c219d8").setTitle(":heart: Please Invite me: ").setDescription("https://discord.com/oauth2/authorize?client_id=769642999227351070&permissions=0&scope=bot")
    .setFooter("And enjoy listening to music!", "https://cdn.discordapp.com/avatars/769642999227351070/f1b78891507308fb76c0a66b56f4bcd6.webp?size=512"));

  }
}
