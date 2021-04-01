const functions = require("../../functions")
const scdl = require("soundcloud-downloader").default;
const config = require("../../config.json")
module.exports = {
    name: "searchsc",
    category: "MUSIC COMMANDS",
    useage: "searchsc <URL/NAME>",
    cooldown: 5,
    description: "Searches for 15 results in SOUNDCLOUD",
    run: async (client, message, args) => {
        //if not a dj, return error  -  DISABLED BECAUSE NOT A DJ CMD
        //if(functions.check_if_dj(message))
        //return functions.embedbuilder(client, 6000, message, config.colors.no, "DJ-ROLE", `❌ You don\'t have permission for this Command! You need to have: ${functions.check_if_dj(message)}`)

        //if member not connected return error
        if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")

        //if they are not in the same channel, return error, but check only if the bot is connected somewhere
        if (message.guild.me.voice.channel && message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)

        //if no arguments added, return error
        if (!args[0]) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " Please add something you wanna search to")

        //if not allowed to CONNECT to the CHANNEL
        if (!message.guild.me.permissionsIn(message.member.voice.channel).has("CONNECT"))  return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`join\` your Channel")

        //If bot not connected, join the channel
        if(!message.guild.me.voice.channel)
        message.member.voice.channel.join().catch(e=>{
            //send error if not possible
            return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`join\` your Channel")
        })
        
        //if not allowed to CONNECT to the CHANNEL
        if (!message.guild.me.permissionsIn(message.member.voice.channel).has("SPEAK")) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`speak\` your Channel")

        
        //send information message
        functions.embedbuilder(client, 3000, message, config.colors.yes, "🔎 Searching!", args.join(" "))

        //search in soundcloud
        scdl.search('tracks', args.join(" "))
            .then(async results => {
                //for each result do this
                let searchresult = "";
                for (let i = 0; i < results.collection.length; i++) {
                    try {
                        let mins = Math.floor((results.collection[i].full_duration / 1000) / 60);
                        let secs = Math.floor((results.collection[i].full_duration / 1000) % 60);
                        if (mins < 10) mins = "0" + mins;
                        if (secs < 10) secs = "0" + secs;
                        let durr = mins + ":" + secs;
                        searchresult += await `**${i+1}**. [${results.collection[i].permalink}](${results.collection[i].permalink_url}) - \`${durr}\`\n`;
                    } catch {
                        searchresult += await " ";
                    }
                }

                //send information message
                await functions.embedbuilder(client, "null", message, config.colors.yes, "🔎 Search Results:", searchresult)

                //wait for userinput with 60 sec. delay
                let userinput;
                await message.channel.awaitMessages(m => m.author.id == message.author.id, {
                    max: 1,
                    time: 60000,
                    errors: ["time"],
                }).then(collected => {
                    //collect his input and saved it on var
                    userinput = collected.first().content;
                    //return if wrong input
                    if (Number(userinput) <= 0 && Number(userinput) > 15) {
                        functions.embedbuilder(client, "null", message, config.colors.no, "Not a right number!", "so i use number 1!")
                        userinput = 1;
                    }
                }).catch(() => {
                    console.error;
                    userinput = 404
                });

                //if something went terrible, wrong send error
                if (userinput === 404) return functions.embedbuilder(client, "null", message, config.colors.no, "Something went wrong!")

                //send information message
                functions.embedbuilder(client, 10000, message, config.colors.yes, "🔎 Searching!", `[${results.collection[userinput - 1].permalink}](${results.collection[userinput - 1].permalink_url})`, results.collection[userinput - 1].artwork_url)

                //play the track
                client.distube.play(message, results.collection[userinput - 1].permalink_url)
            })
            .catch(err => console.log(err))
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
