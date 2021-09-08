const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const {
	check_if_dj
} = require("../../handlers/functions")
module.exports = {
	name: "nowplaying", //the command name for the Slash Command
	category: "Song",
	usage: "nowplaying",
	aliases: ["np", "current"],
	description: "Shows the current Playing Song", //the command description for Slash Command Overview
	cooldown: 5,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	run: async (client, message, args) => {
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
			} = message;
			const {
				guild
			} = member;
			const {
				channel
			} = member.voice;
			if (!channel) return message.reply({
				embeds: [
					new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Please join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!**`)
				],

			})
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`${client.allEmojis.x} Join __my__ Voice Channel!`)
						.setDescription(`<#${guild.me.voice.channel.id}>`)
					],
				});
			}
			try {
				let newQueue = client.distube.getQueue(guildId);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **I am nothing Playing right now!**`)
					],

				})
				let newTrack = newQueue.songs[0];
				message.reply({
					content: `${client.settings.get(guild.id, "prefix")}play ${newTrack.url}`,
					embeds: [
						new MessageEmbed().setColor(ee.color)
						.setTitle(newTrack.name)
						.setURL(newTrack.url)
						.addField(`💡 Requested by:`, `>>> ${newTrack.user}`, true)
						.addField(`⏱ Duration:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
						.addField(`🌀 Queue:`, `>>> \`${newQueue.songs.length} song(s)\`\n\`${newQueue.formattedDuration}\``, true)
						.addField(`🔊 Volume:`, `>>> \`${newQueue.volume} %\``, true)
						.addField(`♾ Loop:`, `>>> ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `${client.allEmojis.check_mark} \`Queue\`` : `${client.allEmojis.check_mark} \`Song\`` : `${client.allEmojis.x}`}`, true)
						.addField(`↪️ Autoplay:`, `>>> ${newQueue.autoplay ? `${client.allEmojis.check_mark}` : `${client.allEmojis.x}`}`, true)
						.addField(`❔ Download Song:`, `>>> [\`Click here\`](${newTrack.streamURL})`, true)
						.addField(`❔ Filter${newQueue.filters.length > 0 ? "s": ""}:`, `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f=>`\`${f}\``).join(`, `)}` : `${client.allEmojis.x}`}`, newQueue.filters.length > 1 ? false : true)
						.addField(`<:Youtube:840260133686870036>  View${newTrack.views > 0 ? "s": ""}:`, `>>> \`${newTrack.views}\``, true)
						.addField(`:thumbsup: Like${newTrack.likes > 0 ? "s": ""}:`, `>>> \`${newTrack.likes}\``, true)
						.addField(`:thumbsdown: Dislike${newTrack.dislikes > 0 ? "s": ""}:`, `>>> \`${newTrack.dislikes}\``, true)
						.setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
						.setFooter(`Played in: ${guild.name}`, guild.iconURL({
							dynamic: true
						})).setTimestamp()
					]
				}).catch((e) => {
					onsole.log(e.stack ? e.stack : e)
				})
			} catch (e) {
				console.log(e.stack ? e.stack : e)
				message.reply({
					content: `${client.allEmojis.x} | Error: `,
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor)
						.setDescription(`\`\`\`${e}\`\`\``)
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
