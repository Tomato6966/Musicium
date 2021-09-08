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
	name: "playskip", //the command name for the Slash Command
	description: "Plays a Song/Playlist and skips!", //the command description for Slash Command Overview
	cooldown: 2,
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
		//INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
		//{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
		{
			"String": {
				name: "song",
				description: "Which Song do you want to play",
				required: true
			}
		}, //to use in the code: interacton.getString("title")
		//{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
		//{"Channel": { name: "in_where", description: "In What Channel should I send it?", required: false }}, //to use in the code: interacton.getChannel("what_channel")
		//{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
		//{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }}, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
		//{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")

	],
	run: async (client, interaction) => {
		try {
			//console.log(interaction, StringOption)

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
			const {
				channel
			} = member.voice;
			if (!channel) return interaction.reply({
				embeds: [
					new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Please join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!**`)
				],
				ephemeral: true
			})
			if (channel.userLimit != 0 && channel.full)
				return interaction.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`<:declined:780403017160982538> Your Voice Channel is full, I can't join!`)
					],
					ephemeral: true
				});
			if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
				return interaction.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`<:declined:780403017160982538> I am already connected somewhere else`)
					],
					ephemeral: true
				});
			}
			//let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices //RETURNS NUMBER
			const Text = options.getString("song"); //same as in StringChoices //RETURNS STRING 
			//update it without a response!
			await interaction.reply({
				content: `🔍 Searching... \`\`\`${Text}\`\`\``,
				ephemeral: true
			});
			try {
				let queue = client.distube.getQueue(guildId)
				let options = {
					member: member,
					skip: true
				}
				if (!queue) options.textChannel = guild.channels.cache.get(channelId)
				if (queue) {
					if (check_if_dj(client, member, queue.songs[0])) {
						return interaction.reply({
							embeds: [new MessageEmbed()
								.setColor(ee.wrongcolor)
								.setFooter(ee.footertext, ee.footericon)
								.setTitle(`${client.allEmojis.x} **You are not a DJ and not the Song Requester!**`)
								.setDescription(`**DJ-ROLES:**\n> ${check_if_dj(client, member, queue.songs[0])}`)
							],
							ephemeral: true
						});
					}
				}
				await client.distube.playVoiceChannel(channel, Text, options)
				//Edit the reply
				interaction.editReply({
					content: `${queue?.songs?.length > 0 ? "⏭ Skipping to" : "🎶 Now Playing"}: \`\`\`css\n${Text}\n\`\`\``,
					ephemeral: true
				});
			} catch (e) {
				console.log(e.stack ? e.stack : e)
				interaction.editReply({
					content: `${client.allEmojis.x} | Error: `,
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor)
						.setDescription(`\`\`\`${e}\`\`\``)
					],
					ephemeral: true
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
