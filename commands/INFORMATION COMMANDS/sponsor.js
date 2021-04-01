const {
	MessageEmbed
} = require("discord.js")
const config = require("../../config.json")
module.exports = {
	name: "sponsor",
    category: "INFORMATION COMMANDS",
	aliases: [""],
	description: "Shows the sponsor of this BoT",
	useage: "sponsor",
	run: async (client, message, args) => {
			message.channel.send(new MessageEmbed()
				.setColor(config.colors.yes)
				.setTimestamp()
				.setFooter("Bittmax.de | Code  'x10'  == -5%", "https://cdn.discordapp.com/icons/784157254847954964/482b9e96414509756fc0192829382776.webp")
				.setImage("https://cdn.discordapp.com/attachments/781568883051462666/800441576442691644/bittmax.png")
				.setTitle("Milrato | Service -- Bittmax")
				.setURL("https://milrato.eu")
				.setDescription(`
				> [Milrato Service](https://discord.gg/terWzJjF7p) made this Bot for us. It is free and also hosted on their sponsor: [Bittmax.de](https://bittmax.de)

				> If you use the code: **\`x10\`** their, then you'll get at least 5% off everything!

				> Check out their [Service-Website](https://milrato) and their [Discord](https://discord.gg/terWzJjF7p) to get your own Bot too!

				> It's hosted **24/7**, as already said, thanks to their Sponsor [**Bittmax.de**](https://bittmax.de)!`)
			)
			message.channel.send(new Discord.MessageEmbed()
				.setColor(config.colors.yes)
				.setTitle("Mc-Host24.de | German Hosting")
				.setURL("https://mc-host24.de")
				.setDescription(`
		    Second Sponsor of This Bot is:
		    **MC-HOST24** THE BEST MC HOSTER
		    > MC-HOST24.de is sponsoring them with some monthly Money,
		    > Thanks to them, they able to host their Website and GAME SERVERS
		    > Our suggestion is, if you want to host games / Websites, then go to [mc-host24.de](https://mc-host24.de/user/affiliate/3121)

		    **What they are offering:**
		    > **>>** Minecraft Hosting, CounterStrike: Global Offensive, Garry's Mod, ARK, ARMA 3, ...
		    > **>>** Cheap and fast Domains
		    > **>>** WEBHOSTING
		    > **>>** TEAMSPEAK SERVERS
		    > **>>** Linux & Windows Root Servers

		    [**Discord Server:**](https://discord.com/invite/4dGuGXK4A4)
		    [**Website:**](https://mc-host24.de/user/affiliate/3121)
		    [**__SPONSOR LINK!__**](https://mc-host24.de/donate/tomato)
		    `)
				.setImage("https://cdn.discordapp.com/attachments/758007636720353380/758055267735699618/MC-HOST24-Logo-24-fett.png")
				.setFooter("Mc-Host24", "https://cdn.discordapp.com/icons/619465432293965864/4c101b43466708cec4506938154a4e34.webp")
			)
	}
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
