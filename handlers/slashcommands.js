const config = require("../config.json")
console.log("LOADING SLASH COMMANDS...")
const Discord = require("discord.js");
module.exports = (client) => {
    ///////////////////////////////
    /////////SLASH COMMANDS////////
    ///////////////////////////////
    client.on('ready', () => {

        //client.api.applications(client.user.id).guilds('guild id').commands.post({data: {     für einen server VVVV ist für mehr als 1 server
        client.api.applications(client.user.id).commands.post({
            data: {
                name: "help",
                description: "Shows you information for every cmd"
            }
        });
        client.api.applications(client.user.id).commands.post({
            data: {
                name: "info",
                description: "See some information about Musicium"
            }
        });
        client.api.applications(client.user.id).commands.post({

            data: {
                name: "invite",
                description: "Invite the Bot to your Own server and get the ultimate music expierence"
            }
        });
        client.ws.on('INTERACTION_CREATE', async interaction => {
            let prefix = await client.settings.get(interaction.guild_id, `prefix`);
            if (prefix === null) prefix = config.prefix;

            const command = interaction.data.name.toLowerCase();
            const args = interaction.data.options;
            const inviteembed = new Discord.MessageEmbed()
                .setColor(config.colors.yes)
                .setTitle("Invite me now!")
                .setDescription(`[\`Click here\`](https://dc.musicium.eu)   |   [\`Website\`](https://musicium.eu)   |   :heart: Thanks for inviting!`)
                .setFooter(client.user.username + " | Syntax:  <>...must    []...optional", client.user.displayAvatarURL())
                .setAuthor(interaction.member.user.username, client.user.displayAvatarURL(), "https://dc.musicium.eu")
            let totalMembers = client.guilds.cache.reduce((c, g) => c + g.memberCount, 0);
            let days = Math.floor(client.uptime / 86400000);
            let hours = Math.floor(client.uptime / 3600000) % 24;
            let minutes = Math.floor(client.uptime / 60000) % 60;
            let seconds = Math.floor(client.uptime / 1000) % 60;

            const infoembed = new Discord.MessageEmbed()
                .setAuthor(
                    `Information about the ${client.user.username} Bot`,
                    client.user.displayAvatarURL(), "https://dc.musicium.eu"
                )
                .setColor(config.colors.yes)
                .addFields({
                        name: 'Bot tag',
                        value: `**\`${client.user.tag}\`**`,
                        inline: true,
                    }, {
                        name: 'Version',
                        value: `**\`7.0.0\`**`,
                        inline: true,
                    }, {
                        name: "Command prefix",
                        value: `**\`${prefix}\`**`,
                        inline: true,
                    },

                    {
                        name: 'Time since last restart',
                        value: `**\`${process.uptime().toFixed(2)}s\`**`,
                        inline: true,
                    }, {
                        name: 'Uptime',
                        value: `**\`${days}d\` \`${hours}h\` \`${minutes}m\` \`${seconds}s\`**`,
                        inline: true,
                    }, {
                        name: 'Server count',
                        value: `**\`${client.guilds.cache.size}\`**`,
                        inline: true,
                    }, {
                        name: 'Total members',
                        value: `**\`${totalMembers}\`**`,
                        inline: true,
                    }, {
                        name: 'Owner and Developer',
                        value: `**\`Tomato#6966\` <@442355791412854784>**`,
                        inline: true,
                    },
                )
                .addField("\u200b", `
            \u200b
            `)
                .addField("***BOT BY:***", `
            >>> <@442355791412854784> \`Tomato#6966\` [\`Website\`](https://musicium.eu)
            `)
                .addField("***SUPPORT:***", `
            >>> [\`Server\`](https://discord.gg/fS6qBSm) | [\`Musicium - Website\`](https://musicium.eu) | [\`Invite\`](https://dc.musicium.eu/)
            `)
            const helpembed = new Discord.MessageEmbed()
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
                >>> <@442355791412854784> \`Tomato#6966\` [\`Website\`](https://musicium.eu) [\`INVITE\`](https://dc.musicium.eu)
                `)
                .addField("**__Music - Supported sources__**", `
                >>> \`Youtube\`, \`Spotify\`, \`Soundcloud\`, [\`More\`](https://links.musicium.eu), ...
                `)
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
            helpembed.setDescription("*use the Prefix infront of EACH command, to use it correctly!*\n" + info);
            if (command == 'help') {


                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: await createAPIMessage(interaction, helpembed)
                    }
                });
            }
            if (command == 'invite') {
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: await createAPIMessage(interaction, inviteembed)
                    }
                });
            }
            if (command == 'info') {
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: await createAPIMessage(interaction, infoembed)
                    }
                });
            }
        });
    });

    async function createAPIMessage(interaction, content) {
        const apiMessage = await Discord.APIMessage.create(client.channels.resolve(interaction.channel_id), content)
            .resolveData()
            .resolveFiles();

        return {
            ...apiMessage.data,
            files: apiMessage.files
        };
    }
    console.log('Loaded Slash Commands');
}
