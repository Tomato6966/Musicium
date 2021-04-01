const functions = require("../../functions")
const config = require("../../config.json")
module.exports = {
    name: "searchrelated",
    category: "MUSIC COMMANDS",
    cooldown: 5,
    aliases: ["searchrelated", "searchsimilar", ],
    useage: "searchrelated --> 'wait' --> Enter a number",
    description: "Seraches similar songs of the current Track and let u choose which one you want",
    run: async (client, message, args) => {
        
        //if not a dj, return error  -  Disabled because not needed
        //if(functions.check_if_dj(message))
        //return functions.embedbuilder(client, 6000, message, config.colors.no, "DJ-ROLE", `❌ You don\'t have permission for this Command! You need to have: ${functions.check_if_dj(message)}`)
    
        //If Bot not connected, return error
        if (!message.guild.me.voice.channel) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")
        
        //if member not connected return error
        if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")
        
        //if they are not in the same channel, return error
        if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)
             
        //get the newsong
        let newsong = await client.distube.addRelatedVideo(message);

        //search for newsongs
        let result = newsong.songs;

        //define variable
        let searchresult = "";

        for (let i = 0; i < result.length; i++) {
            try {
                searchresult += await `**${i+1}**. [${result[i].name}](${result[i].url}) - \`${result[i].formattedDuration}\`\n`;
            } catch {
                searchresult += await " ";
            }
        }
        //send information message
        await functions.embedbuilder(client, "null", message, config.colors.yes, "🔎 Search Results for Related Songs:", searchresult)
        let userinput;
        //wait for userinput
        await message.channel.awaitMessages(m => m.author.id == message.author.id, {
            max: 1,
            time: 60000,
            errors: ["time"],
        }).then(collected => {
            //save userinput
            userinput = collected.first().content;
            //if userinput out of range, error
            if (Number(userinput) <= 0 && Number(userinput) > 10) {
                functions.embedbuilder(client, "null", message, config.colors.no, "Not a right number!", "so i use number 1!")
                userinput = 1;
            }
        }).catch(() => {
            console.error;
            userinput = 404
        });

        //if something went wrong, return error
        if (userinput === 404)  return functions.embedbuilder(client, "null", message, config.colors.no, "Something went wrong! / Time ran out")
        
        //send information message
        functions.embedbuilder(client, 10000, message, config.colors.yes, "🔎 Adding:", `[${result[userinput - 1].name}](${result[userinput - 1].url})`, result[userinput - 1].thumbnail)
        
        //play track
        client.distube.play(message, result[userinput - 1].url)
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
