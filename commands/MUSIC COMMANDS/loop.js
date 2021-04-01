const functions = require("../../functions")
const config = require("../../config.json")
module.exports = {
    name: "loop",
    cooldown: 5,
    category: "MUSIC COMMANDS",
    aliases: ["repeat"],
    useage: "loop <0/1/2> |",
    description: "Enables loop for off / song / queue*\n0 = off\n1 = song\n2 = queue",
    run: async (client, message, args) => {
        ///if not a dj, return error
        if (functions.check_if_dj(message))
            return functions.embedbuilder(client, 6000, message, config.colors.no, "DJ-ROLE", `❌ You don\'t have permission for this Command! You need to have: ${functions.check_if_dj(message)}`)

        //If Bot not connected, return error
        if (!message.guild.me.voice.channel) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")

        //if member not connected return error
        if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")

        //if they are not in the same channel, return error
        if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)

        //if no arguments return error
        if (!args[0]) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " Please add the Loop style Options wanna change", `Valid Options:\n\n\`0\`   /   \`1\`   /   \`2\`\n\`off\` / \`song\` / \`queue\``)

        //set variable
        let loopis = args[0];
        if (args[0].toString().toLowerCase() === "song") loopis = "1";
        else if (args[0].toString().toLowerCase() === "queue") loopis = "2";
        else if (args[0].toString().toLowerCase() === "off") loopis = "0";
        else if (args[0].toString().toLowerCase() === "s") loopis = "1";
        else if (args[0].toString().toLowerCase() === "q") loopis = "2";
        else if (args[0].toString().toLowerCase() === "disable") loopis = "0";
        loopis = Number(loopis);

        //change loop state
        if (0 <= loopis && loopis <= 2) {
            await client.distube.setRepeatMode(message, parseInt(args[0]));
            await functions.embedbuilder(client, 3000, message, config.colors.yes, "Repeat mode set to:", `${args[0].replace("0", "OFF").replace("1", "Repeat song").replace("2", "Repeat Queue")}`)
            return;
        } else {
            return functions.embedbuilder(client, 3000, message, config.colors.no, "ERROR", `Please use a number between **0** and **2**   |   *(0: disabled, 1: Repeat a song, 2: Repeat all the queue)*`)
        }
    }
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
