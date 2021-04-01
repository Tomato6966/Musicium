const {
    MessageEmbed
} = require("discord.js");
const {
    stripIndents
} = require("common-tags");
const config = require("../../config.json")
module.exports = {
    name: "help",
    aliases: ["h"],
    cooldown: 3,
    category: "INFORMATION COMMANDS",
    description: "Returns all commands, or one specific command info",
    useage: "help [Command]",
    run: async (client, message, args) => {
        //GET THE PREFIX
        let prefix = client.settings.get(message.guild.id, `prefix`);
        if (prefix === null) prefix = config.prefix; //if not prefix set it to standard prefix in the config.json file
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            return getAll(client, message);
        }

        function getAll(client, message) {
            const embed1 = new MessageEmbed()
                .setColor(config.colors.yes)
                .setTitle(`Help Menu\nPrefix: \`${prefix}\``)
                .addField("\u200b", "\u200b")
                .addField("**BASSBOOST FILTER INFORMATION**", `
            >>> You can now change the gain of your Bassboost from \`1\`-\`20\`! Example: \`${prefix}bassboost 10\` *Makes a Bassboost with 10db Gain*
            `)
                .addField("**PREMADE CUSTOM PLAYLISTS**", `
            >>> there are several Custom playlists which you can play, each one has 75 songs!
            
            1. Charts
            2. Christmas
            3. Jazz
            4. Blues
            5. Country
            6. Rock
            *more coming soon*
            play them by \`${prefix}playlist <Playlist Number.>\`
            `)
                .addField("**RADIO STATIONS**", `
            >>> there are over 200 radio stations available, you can see them by typing \`${prefix}radio\`
            and play them by \`${prefix}radio <stationnum.>\`
            `)
                .addField("\u200b", "\u200b")
                .addField("**__BOT BY:__**", `
            >>> <@442355791412854784> \`Tomato#6966\` [\`Website\`](https://musicium.eu) [\`INVITE\`](https://dc.musicium.eu) [\`Support Server\`](https://discord.gg/wvCp7q88G3)
            `)
                .addField("**__Music - Supported sources__**", `
            >>> \`Youtube\`, \`Spotify\`, \`Soundcloud\`, [\`More\`](https://links.musicium.eu), ...
            `)
                .setFooter(`Made by: milrato.eu | Tomato#6966`, client.user.displayAvatarURL())
            const embed = new MessageEmbed()
                .setColor(config.colors.yes)
                .setTitle(`Help Menu\nPrefix: \`${prefix}\``)
                .setFooter(`To see command descriptions and usage type   ${prefix}help [CMD Name]`, client.user.displayAvatarURL())

            const commands = (category) => {
                return client.commands
                    .filter(cmd => cmd.category === category)
                    .map(cmd => `\`${cmd.name}\``)
                    .join(", ");
            }

            const info = client.categories
                .map(cat => stripIndents `**__${cat[0].toUpperCase() + cat.slice(1)}__** \n> ${commands(cat)}`)
                .reduce((string, category) => string + "\n\n" + category);

            message.channel.send(embed1)
            return message.channel.send(embed.setDescription("*use the Prefix infront of EACH command, to use it correctly!*\n" + info));
        }

        function getCMD(client, message, input) {
            const embed = new MessageEmbed() //creating a new Embed

            const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase())) //getting the command by name/alias
            if (!cmd) { //if no cmd found return info no infos!
                return message.channel.send(embed.setColor(config.colors.no).setDescription(`No Information found for command **${input.toLowerCase()}**`));
            }
            if (cmd.name) embed.addField("**Command name**", `\`${cmd.name}\``)
            if (cmd.name) embed.setTitle(`Detailed Information about: \`${cmd.name}\``)
            if (cmd.description) embed.addField("**Description**", `\`${cmd.description}\``);

            if (cmd.aliases) embed.addField("**Aliases**", `\`${cmd.aliases.map(a => `${a}`).join("\`, \`")}\``)
            if (cmd.cooldown) embed.addField("**Cooldown**", `\`${cmd.cooldown} Seconds\``)
            else embed.addField("**Cooldown**", `\`2 Seconds\``)
            if (cmd.useage) {
                embed.addField("**Useage**", `\`${config.prefix}${cmd.useage}\``);
                embed.setFooter("Syntax: <> = required, [] = optional");
            }
            return message.channel.send(embed.setColor(config.colors.yes));
        }
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
