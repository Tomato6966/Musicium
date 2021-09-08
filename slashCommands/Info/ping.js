const {
	MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
	name: "ping", //the command name for the Slash Command
	description: "Gives you information on how fast the Bot is", //the command description for Slash Command Overview
	cooldown: 1,
	memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
		//INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
		//{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
		//{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
		//{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
		//{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
		//{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
		//{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
		{
			"StringChoices": {
				name: "what_ping",
				description: "What Ping do you want to get?",
				required: false,
				choices: [
					["Bot", "botping"],
					["Discord Api", "api"]
				]
			}
		}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
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
			//let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices
			const StringOption = options.getString("what_ping"); //same as in StringChoices
			//let UserOption = options.getUser("OPTIONNAME");
			//let ChannelOption = options.getChannel("OPTIONNAME");
			//let RoleOption = options.getRole("OPTIONNAME");
			if (StringOption) {
				if (StringOption == "botping") {
					await interaction.reply({
						ephemeral: true,
						content: `${client.allEmojis.loading} Getting the Bot Ping...`,
						ephemeral: true
					});
					interaction.editReply({
						ephemeral: true,
						content: `${client.allEmojis.ping} Bot Ping: \`${Math.floor((Date.now() - createdTimestamp) - 2 * Math.floor(client.ws.ping))} ms\``,
						ephemeral: true
					})
				}
				//Other Option is API so we are alright
				else {
					interaction.reply({
						ephemeral: true,
						content: `${client.allEmojis.ping} Api Ping: \`${Math.floor(client.ws.ping)} ms\``,
						ephemeral: true
					})
				}
			} else {
				await interaction.reply({
					ephemeral: true,
					content: `${client.allEmojis.loading} Getting the Bot Ping...`,
					ephemeral: true
				});
				interaction.editReply({
					ephemeral: true,
					content: `${client.allEmojis.ping} Bot Ping: \`${Math.floor((Date.now() - createdTimestamp) - 2 * Math.floor(client.ws.ping))} ms\`\n\n${client.allEmojis.ping} Api Ping: \`${Math.floor(client.ws.ping)} ms\``,
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
