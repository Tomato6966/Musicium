const config = require("../config.json")
console.log("Loading Setups")
const functions = require("../functions");
module.exports = (client) => {
    const guildonlycounter = new Map();
    let stateswitch = false;
    client.on("ready", () => {
        setInterval(() => {
            let guilds = client.guilds.cache.keyArray()
            let usercount = 0;
            for (let i = 0; i < guilds.length; i++) {
                usercount += Number(client.guilds.cache.get(guilds[i]).memberCount);
            }
            usercount *= 10;
            usercount = usercount.toString().slice(3)
            stateswitch = !stateswitch; //change state
            if (stateswitch) client.user.setActivity(`${config.prefix}help | musicium.eu`, {
                type: "PLAYING"
            });
            else client.user.setActivity(`${usercount}k User | ${client.guilds.cache.size} Server`, {
                type: "PLAYING"
            });
        }, 5000); //5 second delay

        setInterval(() => {
            client.guilds.cache.forEach(async guild => {
                await functions.delay(client.ws.ping);
                let member = await client.guilds.cache.get(guild.id).members.cache.get(client.user.id)
                //if not connected
                if (!member.voice.channel)
                    return;
                if (member.voice.channel.members.size === 1) {
                    if (!guildonlycounter.has(guild.id)) return guildonlycounter.set(guild.id);
                    guildonlycounter.delete(guild.id);
                    return member.voice.channel.leave();
                }
            });
        }, (30 * 1000));
    });

    client.on("guildCreate", guild => {
        client.settings.delete(guild.id, "prefix");
        client.settings.delete(guild.id, "djroles");
        client.settings.delete(guild.id, "playingembed");
        client.settings.delete(guild.id, "playingchannel");
        client.settings.delete(guild.id, "botchannel");
        client.custom.delete(guild.id, "playlists");
        client.custom.ensure(guild.id, {
            playlists: [],
        });
        client.settings.ensure(guild.id, {
            prefix: config.prefix,
            djroles: [],
            playingembed: "",
            playingchannel: "",
            botchannel: [],
        });
        getAll(client, guild)
    })
    //When a Channel got deleted, try to remove it from the BOTCHANNELS     
    client.on("channelDelete", function (channel) {
        client.settings.remove(channel.guild.id, channel.id, `botchannel`);
    });
    //When a Role got deleted, try to remove it from the DJROLES
    client.on("roleDelete", function (role) {
        client.settings.remove(role.guild.id, role.id, `djroles`);
    });
    client.on("message", async message => {
        client.custom.ensure(message.guild.id, {
            playlists: [],
        });
        client.custom2.ensure(message.author.id, {
            myplaylists: [],
        });
        client.infos.ensure("global", {
            cmds: 0,
            songs: 0,
            filters: 0,
        })
        client.settings.ensure(message.guild.id, {
            prefix: config.prefix,
            djroles: [],
            playingembed: "",
            playingchannel: "",
            botchannel: [],
        });
        if (message.author.bot) return;
        if (!message.guild) return;
        //create the database for the OWN user
        client.custom2.ensure(message.author.id, {
            myplaylists: [],
        });

    });
    const {
        MessageEmbed
    } = require("discord.js");
    const {
        stripIndents
    } = require("common-tags");

    function getAll(client, guild) {
        const embed = new MessageEmbed()
            .setColor(config.colors.yes)
            .setTitle('Help Menu - THANKS FOR INVITING ME!')
            .addField("**__BOT BY:__**", `
                >>> <@442355791412854784> \`Tomato#6966\` [\`Website\`](https://milrato.eu) [\`INVITE\`](https://discord.com/api/oauth2/authorize?client_id=789845410998779904&permissions=8&scope=bot)
                `)
            .addField("**__Music - Supported sources__**", `
                >>> \`Youtube\`, \`Soundcloud\`, [\`More\`](https://links.musicium.eu), ...
                `)
            .setFooter("To see command descriptions and usage type   p!help [CMD Name]", client.user.displayAvatarURL())

        const commands = (category) => {
            return client.commands
                .filter(cmd => cmd.category === category)
                .map(cmd => `\`${cmd.name}\``)
                .join(", ");
        }

        const info = client.categories
            .map(cat => stripIndents `**__${cat[0].toUpperCase() + cat.slice(1)}__** \n> ${commands(cat)}`)
            .reduce((string, category) => string + "\n\n" + category);
        const channel = guild.channels.cache.find(
            channel =>
            channel.type === "text" &&
            channel.permissionsFor(guild.me).has("SEND_MESSAGES")
        );
        return channel.send(embed.setDescription(`*use the Prefix **\`${config.prefix}\`** infront of EACH command, to use it correctly!*\n` + info));
    }
    client.on('voiceStateUpdate', (oldState, newState) => {
        if (newState.id === client.user.id && oldState.serverDeaf === true && newState.serverDeaf === false) {
            try {
                const channel = newState.member.guild.channels.cache.find(
                    channel =>
                    channel.type === "text" &&
                    (channel.name.includes("cmd") || channel.name.includes("command") || channel.name.includes("bot")) &&
                    channel.permissionsFor(newState.member.guild.me).has("SEND_MESSAGES")
                );
                channel.send("Don't unmute me!, i muted my self again! This safes Data so it gives you a faster and smoother experience")
                newState.setDeaf(true);
            } catch (error) {
                try {
                    const channel = newState.member.guild.channels.cache.find(
                        channel =>
                        channel.type === "text" &&
                        channel.permissionsFor(newState.member.guild.me).has("SEND_MESSAGES")
                    );
                    channel.send("Don't unmute me!, i muted my self again! This safes Data so it gives you a faster and smoother experience")
                    newState.setDeaf(true);
                } catch (error) {
                    newState.setDeaf(true);
                }
            }
        }
    });
    console.log("Setups Loaded")
}
