console.log(`Welcome to SERVICE HANDLER /--/ By https://milrato.eu /--/ Discord: Tomato#6966`.yellow);
const PlayerMap = new Map();
const playerintervals = new Map();
const config = require(`../botconfig/config.json`);
const settings = require(`../botconfig/settings.json`);
const ee = require(`../botconfig/embed.json`);
const DisTube = require("distube");
const {
  MessageButton,
  MessageActionRow,
  MessageEmbed,
  Permissions,
  MessageSelectMenu
} = require(`discord.js`);
const { 
  check_if_dj, delay, createBar
} = require(`./functions`);
let songEditInterval = null;
module.exports = (client) => {
  try {
      /**
       * AUTO-RESUME-FUNCTION
       */
      const autoconnect = async () => {
        let guilds = client.autoresume.keyArray();
        console.log(`Autoresume`.brightCyan + ` - All Guilds, to autoresume:`, guilds)
        if (!guilds || guilds.length == 0) return;
        for (const gId of guilds) {
          try {
            let guild = client.guilds.cache.get(gId);
            if (!guild) {
              client.autoresume.delete(gId);
              console.log(`Autoresume`.brightCyan + ` - Bot got Kicked out of the Guild`)
              continue;
            }
            let data = client.autoresume.get(gId);

            let voiceChannel = guild.channels.cache.get(data.voiceChannel);
            if (!voiceChannel && data.voiceChannel) voiceChannel = await guild.channels.fetch(data.voiceChannel).catch(() => {}) || false;
            if (!voiceChannel || !voiceChannel.members || voiceChannel.members.filter(m => !m.user.bot && !m.voice.deaf && !m.voice.selfDeaf).size < 1) {
              client.autoresume.delete(gId);
              console.log(`Autoresume`.brightCyan + ` - Voice Channel is either Empty / no Listeners / got deleted`)
              continue;
            }

            let textChannel = guild.channels.cache.get(data.textChannel);
            if (!textChannel) textChannel = await guild.channels.fetch(data.textChannel).catch(() => {}) || false;
            if (!textChannel) {
              client.autoresume.delete(gId);
              console.log(`Autoresume`.brightCyan + ` - Text Channel got deleted`)
              continue;
            }
            let tracks = data.songs;
            if(!tracks || !tracks[0]){
              console.log(`Autoresume`.brightCyan + ` - Destroyed the player, because there are no tracks available`);
              continue;
            }
            const makeTrack = async track => {
              return new DisTube.Song(
                new DisTube.SearchResult({
                  duration: track.duration,
                  formattedDuration: track.formattedDuration,
                  id: track.id,
                  isLive: track.isLive,
                  name: track.name,
                  thumbnail: track.thumbnail,
                  type: "video",
                  uploader: track.uploader,
                  url: track.url,
                  views: track.views,
                }), guild.members.cache.get(track.memberId) || guild.me, track.source);
            };
            await client.distube.playVoiceChannel(voiceChannel, tracks[0].url, {
              member: guild.members.cache.get(tracks[0].memberId) || guild.me,
              textChannel: textChannel
            })
            let newQueue = client.distube.getQueue(guild.id);
            //tracks = tracks.map(track => makeTrack(track));
            //newQueue.songs = [newQueue.songs[0], ...tracks.slice(1)]
            for(const track of tracks.slice(1)){
              newQueue.songs.push(await makeTrack(track))
            }
            console.log(`Autoresume`.brightCyan + ` - Added ${newQueue.songs.length} Tracks on the QUEUE and started playing ${newQueue.songs[0].name} in ${guild.name}`);
            //ADJUST THE QUEUE SETTINGS
            await newQueue.setVolume(data.volume)
            if (data.repeatMode && data.repeatMode !== 0) {
              newQueue.setRepeatMode(data.repeatMode);
            }
            if (!data.playing) {
              newQueue.pause();
            }
            await newQueue.seek(data.currentTime);
            if(data.filters && data.filters.length > 0){
              await newQueue.setFilter(data.filters, true);
            }
            client.autoresume.delete(newQueue.id)
            console.log(`Autoresume`.brightCyan + " - Changed autoresume track to queue adjustments + deleted the database entry")
            if (!data.playing) {
              newQueue.pause();
            }
            await delay(settings["auto-resume-delay"] || 1000)
          } catch (e) {
            console.log(e)
          }
        }
      }
      client.on("ready", () => {
        setTimeout(() => autoconnect(), 2 * client.ws.ping)
      })
    client.distube
      .on(`playSong`, async (queue, track) => {
        try {
          if(!client.guilds.cache.get(queue.id).me.voice.deaf)
            client.guilds.cache.get(queue.id).me.voice.setDeaf(true).catch((e) => {
              //console.log(e.stack ? String(e.stack).grey : String(e).grey)
            })
        } catch (error) {
          console.log(error)
        }
        try {
          var newQueue = client.distube.getQueue(queue.id)
          updateMusicSystem(newQueue);
          var data = receiveQueueData(newQueue, track)
          if(queue.textChannel.id === client.settings.get(queue.id, `music.channel`)) return;
          //Send message with buttons
          let currentSongPlayMsg = await queue.textChannel.send(data).then(msg => {
            PlayerMap.set(`currentmsg`, msg.id);
            return msg;
          })
          //create a collector for the thinggy
          var collector = currentSongPlayMsg.createMessageComponentCollector({
            filter: (i) => i.isButton() && i.user && i.message.author.id == client.user.id,
            time: track.duration > 0 ? track.duration * 1000 : 600000
          }); //collector for 5 seconds
          //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
          let lastEdited = false;

          /**
           * @INFORMATION - EDIT THE SONG MESSAGE EVERY 10 SECONDS!
           */
          try{clearInterval(songEditInterval)}catch(e){}
          songEditInterval = setInterval(async () => {
            if (!lastEdited) {
              try{
                var newQueue = client.distube.getQueue(queue.id)
                var data = receiveQueueData(newQueue, newQueue.songs[0])
                await currentSongPlayMsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
              }catch (e){
                clearInterval(songEditInterval)
              }
            }
          }, 10000)

          collector.on('collect', async i => {
            if(i.customId != `10` && check_if_dj(client, i.member, client.distube.getQueue(i.guild.id).songs[0])) {
              return i.reply({embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`${client.allEmojis.x} **You are not a DJ and not the Song Requester!**`)
                .setDescription(`**DJ-ROLES:**\n${check_if_dj(client, i.member, client.distube.getQueue(i.guild.id).songs[0])}`)
              ],
              ephemeral: true}).then(interaction => {
                if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                  setTimeout(()=>{
                    try {
                      i.deleteReply().catch(console.log);
                    }catch(e){
                      console.log(e)
                    }
                  }, 3000)
                }
              })
            }
            lastEdited = true;
            setTimeout(() => {
              lastEdited = false
            }, 7000)
            //skip
            if (i.customId == `1`) {
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              //get the player instance
              const queue = client.distube.getQueue(i.guild.id);
              //if no player available return aka not playing anything
              if (!queue || !newQueue.songs || newQueue.songs.length == 0) {
                return i.reply({
                  content: `${client.allEmojis.x} Nothing Playing yet`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              }
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              //if ther is nothing more to skip then stop music and leave the Channel
              if (newQueue.songs.length == 0) {
                //if its on autoplay mode, then do autoplay before leaving...
                  i.reply({
                    embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`⏹ **Stopped playing and left the Channel**`)
                    .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                  }).then(interaction => {
                    if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                      setTimeout(()=>{
                        try {
                          i.deleteReply().catch(console.log);
                        }catch(e){
                          console.log(e)
                        }
                      }, 3000)
                    }
                  })
                  clearInterval(songEditInterval);
                  //edit the current song message
                  await client.distube.stop(i.guild.id)
                return
              }
              //skip the track
              await client.distube.skip(i.guild.id)
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`⏭ **Skipped to the next Song!**`)
                  .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
              }).then(interaction => {
                if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                  setTimeout(()=>{
                    try {
                      i.deleteReply().catch(console.log);
                    }catch(e){
                      console.log(e)
                    }
                  }, 3000)
                }
              })
            }
            //stop
            if (i.customId == `2`) {
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })

              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
                //stop the track
                i.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`⏹ **Stopped playing and left the Channel!**`)
                    .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
                clearInterval(songEditInterval);
                //edit the current song message
                await client.distube.stop(i.guild.id)
            }
            //pause/resume
            if (i.customId == `3`) {
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              if (newQueue.playing) {
                await client.distube.pause(i.guild.id);
                var data = receiveQueueData(client.distube.getQueue(newQueue.id), newQueue.songs[0])
                currentSongPlayMsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
                i.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`⏸ **Paused!**`)
                    .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              } else {
                //pause the player
                await client.distube.resume(i.guild.id);
                var data = receiveQueueData(client.distube.getQueue(newQueue.id), newQueue.songs[0])
                currentSongPlayMsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
                i.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`▶️ **Resumed!**`)
                    .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              }
            }
            //autoplay
            if (i.customId == `4`) {
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              //pause the player
              await newQueue.toggleAutoplay()
              if (newQueue.autoplay) {
                var data = receiveQueueData(client.distube.getQueue(newQueue.id), newQueue.songs[0])
                currentSongPlayMsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
              } else {
                var data = receiveQueueData(client.distube.getQueue(newQueue.id), newQueue.songs[0])
                currentSongPlayMsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
              }
              //Send Success Message
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${newQueue.autoplay ? `${client.allEmojis.check_mark} **Enabled Autoplay**`: `${client.allEmojis.x} **Disabled Autoplay**`}`)
                  .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
            }
            //Shuffle
            if(i.customId == `5`){
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              client.maps.set(`beforeshuffle-${newQueue.id}`, newQueue.songs.map(track => track).slice(1));
              //pause the player
              await newQueue.shuffle()
              //Send Success Message
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`🔀 **Shuffled ${newQueue.songs.length} Songs!**`)
                  .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
              }).then(interaction => {
                if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                  setTimeout(()=>{
                    try {
                      i.deleteReply().catch(console.log);
                    }catch(e){
                      console.log(e)
                    }
                  }, 3000)
                }
              })
            }
            //Songloop
            if(i.customId == `6`){
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              //Disable the Repeatmode
              if(newQueue.repeatMode == 1){
                await newQueue.setRepeatMode(0)
              } 
              //Enable it
              else {
                await newQueue.setRepeatMode(1)
              }
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${newQueue.repeatMode == 1 ? `${client.allEmojis.check_mark} **Enabled Song-Loop**`: `${client.allEmojis.x} **Disabled Song-Loop**`}`)
                  .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
              }).then(interaction => {
                if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                  setTimeout(()=>{
                    try {
                      i.deleteReply().catch(console.log);
                    }catch(e){
                      console.log(e)
                    }
                  }, 3000)
                }
              })
              var data = receiveQueueData(client.distube.getQueue(newQueue.id), newQueue.songs[0])
              currentSongPlayMsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            }
            //Queueloop
            if(i.customId == `7`){
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              //Disable the Repeatmode
              if(newQueue.repeatMode == 2){
                await newQueue.setRepeatMode(0)
              } 
              //Enable it
              else {
                await newQueue.setRepeatMode(2)
              }
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${newQueue.repeatMode == 2 ? `${client.allEmojis.check_mark} **Enabled Queue-Loop**`: `${client.allEmojis.x} **Disabled Queue-Loop**`}`)
                  .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              var data = receiveQueueData(client.distube.getQueue(newQueue.id), newQueue.songs[0])
              currentSongPlayMsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            }
            //Forward
            if(i.customId == `8`){
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              let seektime = newQueue.currentTime + 10;
              if (seektime >= newQueue.songs[0].duration) seektime = newQueue.songs[0].duration - 1;
              await newQueue.seek(Number(seektime))
              collector.resetTimer({time: (newQueue.songs[0].duration - newQueue.currentTime) * 1000})
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`⏩ **Forwarded the song for \`10 Seconds\`!**`)
                  .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
              }).then(interaction => {
                if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                  setTimeout(()=>{
                    try {
                      i.deleteReply().catch(console.log);
                    }catch(e){
                      console.log(e)
                    }
                  }, 3000)
                }
              })
              var data = receiveQueueData(client.distube.getQueue(newQueue.id), newQueue.songs[0])
              currentSongPlayMsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            }
            //Rewind
            if(i.customId == `9`){
              let { member } = i;
              //get the channel instance from the Member
              const { channel } = member.voice
              //if the member is not in a channel, return
              if (!channel)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              //if not in the same channel as the player, return Error
              if (channel.id !== newQueue.voiceChannel.id)
                return i.reply({
                  content: `${client.allEmojis.x} **Please join __my__ Voice Channel first! <#${channel.id}>**`,
                  ephemeral: true
                }).then(interaction => {
                  if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                    setTimeout(()=>{
                      try {
                        i.deleteReply().catch(console.log);
                      }catch(e){
                        console.log(e)
                      }
                    }, 3000)
                  }
                })
              let seektime = newQueue.currentTime - 10;
              if (seektime < 0) seektime = 0;
              if (seektime >= newQueue.songs[0].duration - newQueue.currentTime) seektime = 0;
              await newQueue.seek(Number(seektime))
              collector.resetTimer({time: (newQueue.songs[0].duration - newQueue.currentTime) * 1000})
              i.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`⏪ **Rewinded the song for \`10 Seconds\`!**`)
                  .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true}))]
              }).then(interaction => {
                if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                  setTimeout(()=>{
                    try {
                      i.deleteReply().catch(console.log);
                    }catch(e){
                      console.log(e)
                    }
                  }, 3000)
                }
              })
              var data = receiveQueueData(client.distube.getQueue(newQueue.id), newQueue.songs[0])
              currentSongPlayMsg.edit(data).catch((e) => {
                //console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            }
            //Lyrics
            if(i.customId == `10`){
              return i.reply({
                content: `${client.allEmojis.x} **Lyrics are disabled, due to legal Reason and Lyrics api shutting down!**`,
                ephemeral: true
              }).then(interaction => {
                if(newQueue.textChannel.id === client.settings.get(newQueue.id, `music.channel`)){
                  setTimeout(()=>{
                    try {
                      i.deleteReply().catch(console.log);
                    }catch(e){
                      console.log(e)
                    }
                  }, 3000)
                }
              })
            }
          });
        } catch (error) {
          console.error(error)
        }
      })
      .on(`addSong`, (queue, song) => {
        updateMusicSystem(queue);
        queue.textChannel.send({
          embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
          .setFooter(`💯 ` + song.user.tag, song.user.displayAvatarURL({
            dynamic: true
          }))
          .setTitle(`${client.allEmojis.check_mark} **Song added to the Queue!**`)
          .setDescription(`👍 Song: [\`${song.name}\`](${song.url})  -  \`${song.formattedDuration}\``)
          .addField(`⌛ **Estimated Time:**`, `\`${queue.songs.length - 1} song${queue.songs.length > 0 ? `s` : ``}\` - \`${(Math.floor((queue.duration - song.duration) / 60 * 100) / 100).toString().replace(`.`, `:`)}\``)
          .addField(`🌀 **Queue Duration:**`, `\`${queue.formattedDuration}\``)
          ]
        }).then(msg => {
          if(queue.textChannel.id === client.settings.get(queue.id, `music.channel`)){
            setTimeout(() =>{
              try{
                if(!msg.deleted){
                  msg.delete().catch(() => {});
                }
              }catch (e) {

              }
            })
          }
        }, 3000)
      })
      .on(`addList`, (queue, playlist) => {
        updateMusicSystem(queue);
        queue.textChannel.send({
        embeds: [
          new MessageEmbed()
          .setColor(ee.color)
          .setThumbnail(playlist.thumbnail.url ? playlist.thumbnail.url : `https://img.youtube.com/vi/${playlist.songs[0].id}/mqdefault.jpg`)
          .setFooter(`💯` + playlist.user.tag, playlist.user.displayAvatarURL({
            dynamic: true
          }))
          .setTitle(`${client.allEmojis.check_mark} **Playlist added to the Queue!**`)
          .setDescription(`👍 Playlist: [\`${playlist.name}\`](${playlist.url ? playlist.url : ``})  -  \`${playlist.songs.length} Song${playlist.songs.length > 0 ? `s` : ``}\``)
          .addField(`⌛ **Estimated Time:**`, `\`${queue.songs.length - - playlist.songs.length} song${queue.songs.length > 0 ? `s` : ``}\` - \`${(Math.floor((queue.duration - playlist.duration) / 60 * 100) / 100).toString().replace(`.`, `:`)}\``)
          .addField(`🌀 **Queue Duration:**`, `\`${queue.formattedDuration}\``)
        ]
        }).then(msg => {
          if(queue.textChannel.id === client.settings.get(queue.id, `music.channel`)){
            setTimeout(() =>{
              try{
                if(!msg.deleted){
                  msg.delete().catch(() => {});
                }
              }catch (e) {

              }
            }, 3000)
          }
        })
      })
      // DisTubeOptions.searchSongs = true
      .on(`searchResult`, (message, result) => {
        let i = 0
        message.channel.send(`**Choose an option from below**\n${result.map((song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join(`\n`)}\n*Enter anything else or wait 60 seconds to cancel*`)
      })
      // DisTubeOptions.searchSongs = true
      .on(`searchCancel`, message => message.channel.send(`Searching canceled`).catch((e)=>console.log(e)))
      .on(`error`, (channel, e) => {
        channel.send(`An error encountered: ${e}`).catch((e)=>console.log(e))
        console.error(e)
      })
      .on(`empty`, channel => channel.send(`Voice channel is empty! Leaving the channel...`).catch((e)=>console.log(e)))
      .on(`searchNoResult`, message => message.channel.send(`No result found!`).catch((e)=>console.log(e)))
      .on(`finishSong`, (queue, song) => {
        var embed = new MessageEmbed().setColor(ee.color)
        .setAuthor(`${song.name}`, `https://cdn.discordapp.com/attachments/883978730261860383/883978741892649000/847032838998196234.png`, song.url)
        .setDescription(`See the [Queue on the **DASHBOARD** Live!](${require(`../dashboard/settings.json`).website.domain}/${queue.id})`)
        .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
        .setFooter(`💯 ${song.user.tag}\n⛔️ SONG ENDED!`, song.user.displayAvatarURL({
          dynamic: true
        }));
        queue.textChannel.messages.fetch(PlayerMap.get(`currentmsg`)).then(currentSongPlayMsg=>{
          currentSongPlayMsg.edit({embeds: [embed], components: []}).catch((e) => {
            //console.log(e.stack ? String(e.stack).grey : String(e).grey)
          })
        }).catch((e) => {
          //console.log(e.stack ? String(e.stack).grey : String(e).grey)
        })
      })
      .on(`deleteQueue`, queue => {
        if(!PlayerMap.has(`deleted-${queue.id}`)) {
          PlayerMap.set(`deleted-${queue.id}`, true);
          if(client.maps.has(`beforeshuffle-${queue.id}`)){
            client.maps.delete(`beforeshuffle-${newQueue.id}`);
          }
          try {
            //Delete the interval for the check relevant messages system so
            clearInterval(playerintervals.get(`checkrelevantinterval-${queue.id}`))
            playerintervals.delete(`checkrelevantinterval-${queue.id}`);
            // Delete the Interval for the autoresume saver
            clearInterval(playerintervals.get(`autoresumeinterval-${queue.id}`))
            if (client.autoresume.has(queue.id)) client.autoresume.delete(queue.id); //Delete the db if it's still in there
            playerintervals.delete(`autoresumeinterval-${queue.id}`);
            // Delete the interval for the Music Edit Embeds System
            clearInterval(playerintervals.get(`musicsystemeditinterval-${queue.id}`))
            playerintervals.delete(`musicsystemeditinterval-${queue.id}`);
          } catch(e){
            console.log(e)
          }
          updateMusicSystem(queue, true);
          queue.textChannel.send({
            embeds: [
              new MessageEmbed().setColor(ee.color).setFooter(ee.footertext, ee.footericon)
              .setTitle(`⛔️ LEFT QUEUE GOT DELETED`)
              .setDescription(`:headphones: **The QUEUE got deleted**`)
              .setTimestamp()
            ]
          }).then(msg => {
            if(queue.textChannel.id === client.settings.get(queue.id, `music.channel`)){
              setTimeout(() =>{
                try{
                  if(!msg.deleted){
                    msg.delete().catch(() => {});
                  }
                }catch (e) {
  
                }
              })
            }
          }, 3000)
        }
      })
      .on(`initQueue`, queue => {
        try {
          if(PlayerMap.has(`deleted-${queue.id}`)) {
            PlayerMap.delete(`deleted-${queue.id}`)
          }
          let data = client.settings.get(queue.id)
          queue.autoplay = Boolean(data.defaultautoplay);
          queue.volume = Number(data.defaultvolume);
          queue.setFilter(data.defaultfilters);
          
          /**
           * Check-Relevant-Messages inside of the Music System Request Channel
           */
          var checkrelevantinterval = setInterval(async () => {
            if (client.settings.get(queue.id, `music.channel`) && client.settings.get(queue.id, `music.channel`).length > 5) {
              console.log(`Music System - Relevant Checker`.brightCyan + ` - Checkingfor unrelevant Messages`)
              let messageId = client.settings.get(queue.id, `music.message`);
              //try to get the guild
              let guild = client.guilds.cache.get(queue.id);
              if (!guild) return console.log(`Music System - Relevant Checker`.brightCyan + ` - Guild not found!`)
              //try to get the channel
              let channel = guild.channels.cache.get(client.settings.get(queue.id, `music.channel`));
              if (!channel) channel = await guild.channels.fetch(client.settings.get(queue.id, `music.channel`)).catch(() => {}) || false
              if (!channel) return console.log(`Music System - Relevant Checker`.brightCyan + ` - Channel not found!`)
              if (!channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)) return console.log(`Music System - Relevant Checker`.brightCyan + ` - Missing Permissions`)
              //try to get the channel
              let messages = await channel.messages.fetch();
              if (messages.filter(m => m.id != messageId).size > 0) {
                channel.bulkDelete(messages.filter(m => m.id != messageId)).catch(() => {})
                  .then(messages => console.log(`Music System - Relevant Checker`.brightCyan + ` - Bulk deleted ${messages.size} messages`))
              } else {
                console.log(`Music System - Relevant Checker`.brightCyan + ` - No Relevant Messages`)
              }
            }
          }, settings["music-system-relevant-checker-delay"] || 60000);
          playerintervals.set(`checkrelevantinterval-${queue.id}`, checkrelevantinterval);
          
          /**
           * AUTO-RESUME-DATABASING
           */
          var autoresumeinterval = setInterval(async () => {
            var newQueue = client.distube.getQueue(queue.id);
            if (newQueue && newQueue.id && client.settings.get(newQueue.id, `autoresume`)) {
              const makeTrackData = track => {
                return {
                  memberId: track.member.id, 
                  source: track.source,
                  duration: track.duration,
                  formattedDuration: track.formattedDuration,
                  id: track.id,
                  isLive: track.isLive,
                  name: track.name,
                  thumbnail: track.thumbnail,
                  type: "video",
                  uploader: track.uploader,
                  url: track.url,
                  views: track.views,
                }
              }
              client.autoresume.ensure(newQueue.id, {
                guild: newQueue.id,
                voiceChannel: newQueue.voiceChannel ? newQueue.voiceChannel.id : null,
                textChannel: newQueue.textChannel ? newQueue.textChannel.id : null,
                songs: newQueue.songs && newQueue.songs.length > 0 ? [...newQueue.songs].map(track => makeTrackData(track)) : null,
                volume: newQueue.volume,
                repeatMode: newQueue.repeatMode,
                playing: newQueue.playing,
                currentTime: newQueue.currentTime,
                filters: [...newQueue.filters].filter(Boolean),
                autoplay: newQueue.autoplay,
              });
              let data = client.autoresume.get(newQueue.id);
              if (data.guild != newQueue.id) client.autoresume.set(newQueue.id, newQueue.id, `guild`)
              if (data.voiceChannel != newQueue.voiceChannel ? newQueue.voiceChannel.id : null) client.autoresume.set(newQueue.id, newQueue.voiceChannel ? newQueue.voiceChannel.id : null, `voiceChannel`)
              if (data.textChannel != newQueue.textChannel ? newQueue.textChannel.id : null) client.autoresume.set(newQueue.id, newQueue.textChannel ? newQueue.textChannel.id : null, `textChannel`)

              if (data.volume != newQueue.volume) client.autoresume.set(newQueue.id, newQueue.volume, `volume`)
              if (data.repeatMode != newQueue.repeatMode) client.autoresume.set(newQueue.id, newQueue.repeatMode, `repeatMode`)
              if (data.playing != newQueue.playing) client.autoresume.set(newQueue.id, newQueue.playing, `playing`)
              if (data.currentTime != newQueue.currentTime) client.autoresume.set(newQueue.id, newQueue.currentTime, `currentTime`)
              if (!arraysEqual([...data.filters].filter(Boolean), [...newQueue.filters].filter(Boolean))) client.autoresume.set(newQueue.id, [...newQueue.filters].filter(Boolean), `filters`)
              if (data.autoplay != newQueue.autoplay) client.autoresume.set(newQueue.id, newQueue.autoplay, `autoplay`)
              if (newQueue.songs && !arraysEqual(data.songs, [...newQueue.songs])) client.autoresume.set(newQueue.id, [...newQueue.songs].map(track => makeTrackData(track)), `songs`)

              function arraysEqual(a, b) {
                if (a === b) return true;
                if (a == null || b == null) return false;
                if (a.length !== b.length) return false;

                for (var i = 0; i < a.length; ++i) {
                  if (a[i] !== b[i]) return false;
                }
                return true;
              }
            }
          }, settings["auto-resume-save-cooldown"] || 5000);
          playerintervals.set(`autoresumeinterval-${queue.id}`, autoresumeinterval);

          /**
           * Music System Edit Embeds
           */

          var musicsystemeditinterval = setInterval(async () => {
            if (client.settings.get(queue.id, `music.channel`) && client.settings.get(queue.id, `music.channel`).length > 5) {
              let messageId = client.settings.get(queue.id, `music.message`);
              //try to get the guild
              let guild = client.guilds.cache.get(queue.id);
              if (!guild) return console.log(`Music System Edit Embeds`.brightMagenta + ` - Music System - Guild not found!`)
              //try to get the channel
              let channel = guild.channels.cache.get(client.settings.get(queue.id, `music.channel`));
              if (!channel) channel = await guild.channels.fetch(client.settings.get(queue.id, `music.channel`)).catch(() => {}) || false
              if (!channel) return console.log(`Music System Edit Embeds`.brightMagenta + ` - Music System - Channel not found!`)
              if (!channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)) return console.log(`Music System - Missing Permissions`)
              //try to get the channel
              let message = channel.messages.cache.get(messageId);
              if (!message) message = await channel.messages.fetch(messageId).catch(() => {}) || false;
              if (!message) return console.log(`Music System Edit Embeds`.brightMagenta + ` - Music System - Message not found!`)
              if(!message.editedTimestamp) return console.log(`Music System Edit Embeds`.brightCyan + ` - Never Edited before!`)
              if(Date.now() - message.editedTimestamp > (settings["music-request-edit-delay"] || 7000) - 100)
              {
                var data = generateQueueEmbed(client, queue.id)
                message.edit(data).catch((e) => {
                  console.log(e)
                }).then(m => {
                  console.log(`Music System Edit Embeds`.brightMagenta + ` - Edited the Music System Embed, because no other edit in the last ${Math.floor((settings["music-request-edit-delay"] || 7000) / 1000)} Seconds!`)
                })
              }
            }
          }, settings["music-request-edit-delay"] || 7000);
          playerintervals.set(`musicsystemeditinterval-${queue.id}`, musicsystemeditinterval);
        } catch (error) {
          console.error(error)
        }
      });
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
  //for the music system requesting songs
  client.on(`messageCreate`, async (message) => {
    if(!message.guild) return;
    client.settings.ensure(message.guild.id, {
      prefix: config.prefix,
      music: {
        channel: "",
        message: "",
      }
    })
    let data = client.settings.get(message.guild.id, `music`);
    if(!data.channel || data.channel.length < 5) return;
    let textChannel = message.guild.channels.cache.get(data.channel) || await message.guild.channels.fetch(data.channel).catch(() => {}) || false;
    if(!textChannel) {
      client.settings.set(message.guild.id, "", "music.channel");
      client.settings.set(message.guild.id, "", "music.message");
      return;
    }
    if(message.channel.id != textChannel.id) return;
    //Delete the message once it got sent into the channel, bot messages after 5 seconds, user messages instantly!
    if (message.author.id === client.user.id) {
      setTimeout(()=>{
        if (!message.deleted) {
          message.delete().catch((e) => {
            console.log(e)
          })
        }
      }, 3000)
    } else {
      if (!message.deleted) {
        message.delete().catch((e) => {
          console.log(e)
        })
      }
    }
    if(message.author.bot) return;
    var prefix = client.settings.get(message.guild.id, `prefix`);
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`); //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
    var args, cmd;
    if(prefixRegex.test(message.content)) {
       //if there is a attached prefix try executing a cmd!
       const [, matchedPrefix] = message.content.match(prefixRegex); //now define the right prefix either ping or not ping
       args = message.content.slice(matchedPrefix.length).trim().split(/ +/); //create the arguments with sliceing of of the rightprefix length
       cmd = args.shift().toLowerCase(); //creating the cmd argument by shifting the args by 1
       if (cmd || cmd.length === 0) return 
 
       var command = client.commands.get(cmd); //get the command from the collection
       if (!command) command = client.commands.get(client.aliases.get(cmd)); //if the command does not exist, try to get it by his alias
       if (command) //if the command is now valid
       {
         return 
       }
    }
    args = message.content.split(` `);
    const {
      channel
    } = message.member.voice;
    if (!channel) return message.reply({
      embeds: [
        new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Please join ${guild.me.voice.channel ? `__my__` : `a`} VoiceChannel First!**`)
      ],
    })
    if (channel.userLimit != 0 && channel.full)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${client.allEmojis.x} Your Voice Channel is full, I can't join!`)
        ],
      });
    if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${client.allEmojis.x} I am already connected somewhere else`)
        ],
      });
    }
    const Text = args.join(` `) //same as in StringChoices //RETURNS STRING 
    
    try {
      let queue = client.distube.getQueue(message.guild.id)
      let options = {
        member: message.member,
      }
      if (!queue) options.textChannel = message.guild.channels.cache.get(message.channel.id)
      await client.distube.playVoiceChannel(channel, Text, options)
     
    } catch (e) {
      console.log(e.stack ? e.stack : e)
      message.reply({
        content: `${client.allEmojis.x} | Error: `,
        embeds: [
          new MessageEmbed().setColor(ee.wrongcolor)
          .setDescription(`\`\`\`${String(e.message ? e.message : e).substr(0, 2000)}\`\`\``)
        ],
      })
    }
    
  })
  //for the music system interaction buttonjs and meu
  client.on(`interactionCreate`, async (interaction) => {
    if (!interaction.isButton() && !interaction.isSelectMenu()) return;
    var {
      guild,
      message,
      channel,
      member,
      user
    } = interaction;
    if (!guild) guild = client.guilds.cache.get(interaction.guildId);
    if (!guild) return;
    var prefix = client.settings.get(guild.id);
    var data = client.settings.get(guild.id, `music`);
    var musicChannelId = data.channel;
    var musicChannelMessage = data.message;
    //if not setupped yet, return
    if (!musicChannelId || musicChannelId.length < 5) return;
    if (!musicChannelMessage || musicChannelMessage.length < 5) return;
    //if the channel doesnt exist, try to get it and the return if still doesnt exist
    if (!channel) channel = guild.channels.cache.get(interaction.channelId);
    if (!channel) return;
    //if not the right channel return
    if (musicChannelId != channel.id) return;
    //if not the right message, return
    if (musicChannelMessage != message.id) return;

    if (!member) member = guild.members.cache.get(user.id);
    if (!member) member = await guild.members.fetch(user.id).catch(() => {});
    if (!member) return;
    //if the member is not connected to a vc, return
    if (!member.voice.channel) return interaction.reply({
      ephemeral: true,
      content: `${client.allEmojis.x} **Please Connect to a Voice Channel first!**`
    })
    //now its time to start the music system
    if (!member.voice.channel)
      return interaction.reply({
        content: `${client.allEmojis.x} **Please join a Voice Channel first!**`,
        ephemeral: true
      })
      if (!member.voice.channel) return message.reply({
				embeds: [
					new MessageEmbed().setColor(ee.wrongcolor).setTitle(`${client.allEmojis.x} **Please join ${guild.me.voice.channel ? `__my__` : `a`} VoiceChannel First!**`)
				],
			})
			if (member.voice.channel.userLimit != 0 && member.voice.channel.full)
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`${client.allEmojis.x} Your Voice Channel is full, I can't join!`)
					],
				});
			if (guild.me.voice.channel && guild.me.voice.channel.id != member.voice.channel.id) {
				return message.reply({
					embeds: [new MessageEmbed()
						.setColor(ee.wrongcolor)
						.setFooter(ee.footertext, ee.footericon)
						.setTitle(`${client.allEmojis.x} I am already connected somewhere else`)
					],
				});
			}
    let newQueue = client.distube.getQueue(guild.id);
    //if not connected to the same voice channel, then make sure to connect to it!
    if (interaction.isButton()) {
      if (!newQueue || !newQueue.songs || !newQueue.songs[0]) {
        return interaction.reply({
          content: `${client.allEmojis.x} Nothing Playing yet`,
          ephemeral: true
        })
      }
      //here i use my check_if_dj function to check if he is a dj if not then it returns true, and it shall stop!
      if (newQueue && interaction.customId != `Lyrics` && check_if_dj(client, member, newQueue.songs[0])) {
        return interaction.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${client.allEmojis.x} **You are not a DJ and not the Song Requester!**`)
            .setDescription(`**DJ-ROLES:**\n${check_if_dj(client, member, newQueue.songs[0])}`)
          ],
          ephemeral: true
        });
      }
      switch (interaction.customId) {
        case `Skip`: {
          //if ther is nothing more to skip then stop music and leave the Channel
          if (newQueue.songs.length == 0) {
            //if its on autoplay mode, then do autoplay before leaving...
            interaction.reply({
              embeds: [new MessageEmbed()
                .setColor(ee.color)
                .setTimestamp()
                .setTitle(`⏹ **Stopped playing and left the Channel**`)
                .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                  dynamic: true
                }))
              ]
            })
            await newQueue.stop()
            return
          }
          //skip the track
          await newQueue.skip();
          interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(ee.color)
              .setTimestamp()
              .setTitle(`⏭ **Skipped to the next Song!**`)
              .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                dynamic: true
              }))
            ]
          })
          
        }
        break;
      case `Stop`: {
        //Stop the player
        interaction.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.color)
            .setTimestamp()
            .setTitle(`⏹ **Stopped playing and left the Channel**`)
            .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
              dynamic: true
            }))
          ]
        })
        if (newQueue) {
          await newQueue.stop();
        }
        
      }
      break;
      case `Pause`: {
        if (newQueue.paused) {
          newQueue.resume();
          interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(ee.color)
              .setTimestamp()
              .setTitle(`▶️ **Resumed!**`)
              .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                dynamic: true
              }))
            ]
          })
        } else {
          //pause the player
          await newQueue.pause();

          interaction.reply({
            embeds: [new MessageEmbed()
              .setColor(ee.color)
              .setTimestamp()
              .setTitle(`⏸ **Paused!**`)
              .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
                dynamic: true
              }))
            ]
          })
        }
        
      }
      break;
      case `Autoplay`: {
        //pause the player
        newQueue.toggleAutoplay();
        interaction.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.color)
            .setTimestamp()
            .setTitle(`${newQueue.autoplay ? `${client.allEmojis.check_mark} **Enabled Autoplay**`: `${client.allEmojis.x} **Disabled Autoplay**`}`)
            .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
              dynamic: true
            }))
          ]
        })
        
      }
      break;
      case `Shuffle`: {
        //set into the player instance an old Queue, before the shuffle...
        client.maps.set(`beforeshuffle-${newQueue.id}`, newQueue.songs.map(track => track).slice(1));
        //shuffle the Queue
        await newQueue.shuffle();
        //Send Success Message
        interaction.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.color)
            .setTimestamp()
            .setTitle(`🔀 **Shuffled ${newQueue.songs.length} Songs!**`)
            .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
              dynamic: true
            }))
          ]
        })
        
      }
      break;
      case `Song`: {
        //if there is active queue loop, disable it + add embed information
        if (newQueue.repeatMode == 1) {
          await newQueue.setRepeatMode(0);
        } else {
          await newQueue.setRepeatMode(1);
        }
        interaction.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.color)
            .setTimestamp()
            .setTitle(`${newQueue.repeatMode == 1 ? `${client.allEmojis.check_mark} **Enabled Song Loop**`: `${client.allEmojis.x} **Disabled Song Loop**`}`)
            .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
              dynamic: true
            }))
          ]
        })
        
      }
      break;
      case `Queue`: {
        //if there is active queue loop, disable it + add embed information
        if (newQueue.repeatMode == 2) {
          await newQueue.setRepeatMode(0);
        } else {
          await newQueue.setRepeatMode(2);
        }
        interaction.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.color)
            .setTimestamp()
            .setTitle(`${newQueue.repeatMode == 2 ? `${client.allEmojis.check_mark} **Enabled Queue Loop**`: `${client.allEmojis.x} **Disabled Queue Loop**`}`)
            .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
              dynamic: true
            }))
          ]
        })
        
      }
      break;
      case `Forward`: {
        //get the seektime variable of the user input
				let seektime = newQueue.currentTime + 10;
				if (seektime >= newQueue.songs[0].duration) seektime = newQueue.songs[0].duration - 1;
        //seek to the new Seek position
        await newQueue.seek(seektime);
        interaction.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.color)
            .setTimestamp()
            .setTitle(`⏩ **Forwarded the song for \`10 Seconds\`!**`)
            .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
              dynamic: true
            }))
          ]
        })
        
      }
      break;
      case `Rewind`: {
				let seektime = newQueue.currentTime - 10;
				if (seektime < 0) seektime = 0;
				if (seektime >= newQueue.songs[0].duration - newQueue.currentTime) seektime = 0;
        //seek to the new Seek position
        await newQueue.seek(seektime);
        interaction.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.color)
            .setTimestamp()
            .setTitle(`⏪ **Rewinded the song for \`10 Seconds\`!**`)
            .setFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({
              dynamic: true
            }))
          ]
        })
      }
      break;
      case `Lyrics`: {

      }
      break;
      }
      updateMusicSystem(newQueue);
    }
    if (interaction.isSelectMenu()) {
      let link = `https://www.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj`;
      if (interaction.values[0]) {
        //ncs | no copyrighted music
        if (interaction.values[0].toLowerCase().startsWith(`n`)) link = `https://open.spotify.com/playlist/7sZbq8QGyMnhKPcLJvCUFD`;
        //pop
        if (interaction.values[0].toLowerCase().startsWith(`p`)) link = `https://www.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj`;
        //default
        if (interaction.values[0].toLowerCase().startsWith(`d`)) link = `https://www.youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj`;
        //remixes from Magic Release
        if (interaction.values[0].toLowerCase().startsWith(`re`)) link = `https://www.youtube.com/watch?v=NX7BqdQ1KeU&list=PLYUn4YaogdahwfEkuu5V14gYtTqODx7R2`
        //rock
        if (interaction.values[0].toLowerCase().startsWith(`ro`)) link = `https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U`;
        //oldgaming
        if (interaction.values[0].toLowerCase().startsWith(`o`)) link = `https://www.youtube.com/watch?v=iFOAJ12lDDU&list=PLYUn4YaogdahPQPTnBGCrytV97h8ABEav`
        //gaming
        if (interaction.values[0].toLowerCase().startsWith(`g`)) link = `https://open.spotify.com/playlist/4a54P2VHy30WTi7gix0KW6`;
        //Charts
        if (interaction.values[0].toLowerCase().startsWith(`cha`)) link = `https://www.youtube.com/playlist?list=PLMC9KNkIncKvYin_USF1qoJQnIyMAfRxl`
        //Chill
        if (interaction.values[0].toLowerCase().startsWith(`chi`)) link = `https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6`;
        //Jazz
        if (interaction.values[0].toLowerCase().startsWith(`j`)) link = `https://open.spotify.com/playlist/37i9dQZF1DXbITWG1ZJKYt`;
        //blues
        if (interaction.values[0].toLowerCase().startsWith(`b`)) link = `https://open.spotify.com/playlist/37i9dQZF1DXd9rSDyQguIk`;
        //strange-fruits
        if (interaction.values[0].toLowerCase().startsWith(`s`)) link = `https://open.spotify.com/playlist/6xGLprv9fmlMgeAMpW0x51`;
        //magic-release
        if (interaction.values[0].toLowerCase().startsWith(`ma`)) link = `https://www.youtube.com/watch?v=WvMc5_RbQNc&list=PLYUn4Yaogdagvwe69dczceHTNm0K_ZG3P`
        //metal
        if (interaction.values[0].toLowerCase().startsWith(`me`)) link = `https://open.spotify.com/playlist/37i9dQZF1DX9qNs32fujYe`;
        //heavy metal
        if (interaction.values[0].toLowerCase().startsWith(`h`)) link = `https://open.spotify.com/playlist/37i9dQZF1DX9qNs32fujYe`;
      }
      await interaction.reply({
				content: `${client.allEmojis.loading} Loading the **'${interaction.values[0]}' Music Mix**`,
			});
			try {
				let options = {
					member: member,
				}
				if (!newQueue) options.textChannel = guild.channels.cache.get(channel.id)
				await client.distube.playVoiceChannel(member.voice.channel, link, options)
				//Edit the reply
				interaction.editReply({
					content: `${newQueue?.songs?.length > 0 ? `👍 Loaded` : `🎶 Now Playing`}: the **'${interaction.values[0]}'**`,
				});
			} catch (e) {
				console.log(e.stack ? e.stack : e)
				interaction.editReply({
					content: `${client.allEmojis.x} | Error: `,
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor)
						.setDescription(`\`\`\`${e}\`\`\``)
					],

				})
			}
    }

  })
  
  async function updateMusicSystem(queue, leave = false) {
    if(!queue) return;
    if (client.settings.get(queue.id, `music.channel`) && client.settings.get(queue.id, `music.channel`).length > 5) {
      let messageId = client.settings.get(queue.id, `music.message`);
      //try to get the guild
      let guild = client.guilds.cache.get(queue.id);
      if (!guild) return console.log(`Update-Music-System`.brightCyan + ` - Music System - Guild not found!`)
      //try to get the channel
      let channel = guild.channels.cache.get(client.settings.get(queue.id, `music.channel`));
      if (!channel) channel = await guild.channels.fetch(client.settings.get(queue.id, `music.channel`)).catch(() => {}) || false
      if (!channel) return console.log(`Update-Music-System`.brightCyan + ` - Music System - Channel not found!`)
      if (!channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)) return console.log(`Music System - Missing Permissions`)
      //try to get the channel
      let message = channel.messages.cache.get(messageId);
      if (!message) message = await channel.messages.fetch(messageId).catch(() => {}) || false;
      if (!message) return console.log(`Update-Music-System`.brightCyan + ` - Music System - Message not found!`)
      //edit the message so that it's right!
      var data = generateQueueEmbed(client, queue.id, leave)
      message.edit(data).catch((e) => {
        console.log(e)
      }).then(m => {
        console.log(`Update-Music-System`.brightCyan + ` - Edited the message due to a User Interaction`)
      })
    }
  }


  //For the Music Request System
  function generateQueueEmbed(client, guildId, leave) {
    let guild = client.guilds.cache.get(guildId)
    if (!guild) return;
    var embeds = [
      new MessageEmbed()
      .setColor(ee.color)
      .setTitle(`📃 Queue of __${guild.name}__`)
      .setDescription(`**Currently there are __0 Songs__ in the Queue**`)
      .setThumbnail(guild.iconURL({
        dynamic: true
      })),
      new MessageEmbed()
      .setColor(ee.color)
      .setFooter(guild.name, guild.iconURL({
        dynamic: true
      }))
      .setImage(guild.banner ? guild.bannerURL({
        size: 4096
      }) : `https://imgur.com/jLvYdb4.png`)
      .setTitle(`Start Listening to Music, by connecting to a Voice Channel and sending either the **SONG LINK** or **SONG NAME** in this Channel!`)
      .setDescription(`> *I support <:Youtube:840260133686870036> Youtube, <:Spotify:846090652231663647> Spotify, <:soundcloud:825095625884434462> Soundcloud and direct MP3 Links!*`)
    ]
    let newQueue = client.distube.getQueue(guild.id);
    var djs = client.settings.get(guild.id, `djroles`);
    if(!djs || !Array.isArray(djs)) djs = [];
    else djs = djs.map(r => `<@&${r}>`);
    if(djs.length == 0 ) djs = `\`not setup\``;
    else djs.slice(0, 15).join(`, `);
    if (!leave && newQueue && newQueue.songs[0]) {
      embeds[1].setImage(`https://img.youtube.com/vi/${newQueue.songs[0].id}/mqdefault.jpg`)
        .setFooter(`Requested by: ${newQueue.songs[0].user?.tag}`, newQueue.songs[0].user?.displayAvatarURL({
          dynamic: true
        }))
        .addField(`💡 Requested by:`, `>>> ${newQueue.songs[0].user}`, true)
        .addField(`🔊 Volume:`, `>>> \`${newQueue.volume} %\``, true)
        .addField(`${newQueue.playing ? `♾ Loop (▶️):` : `⏸️ Paused:`}`, newQueue.playing ? `>>> ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `${client.allEmojis.check_mark}\` Queue\`` : `${client.allEmojis.check_mark} \`Song\`` : `${client.allEmojis.x}`}` : `>>> ${client.allEmojis.check_mark}`, true)
        .addField(`❔ Filter${newQueue.filters.length > 0 ? `s`: ``}:`, `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f=>`\`${f}\``).join(`, `)}` : `${client.allEmojis.x}`}`, newQueue.filters.length > 4 ? false : true)
        .addField(`🎧 DJ-Role${client.settings.get(newQueue.id, `djroles`).length > 1 ? `s`: ``}:`, `>>> ${djs}`, newQueue.filters.length > 4 ? false : true)
        .addField(`⏱ Duration:`, `\`${newQueue.formattedCurrentTime}\` ${createBar(newQueue.songs[0].duration, newQueue.currentTime, 13)} \`${newQueue.songs[0].formattedDuration}\``)
        .setAuthor(`${newQueue.songs[0].name}`, `https://images-ext-1.discordapp.net/external/DkPCBVBHBDJC8xHHCF2G7-rJXnTwj_qs78udThL8Cy0/%3Fv%3D1/https/cdn.discordapp.com/emojis/859459305152708630.gif`, newQueue.songs[0].url)
      delete embeds[1].description;
      delete embeds[1].title;
      //get the right tracks of the current tracks
      const tracks = newQueue.songs;
      var maxTracks = 10; //tracks / Queue Page
      //get an array of quelist where 10 tracks is one index in the array
      var songs = tracks.slice(0, maxTracks);
      embeds[0] = new MessageEmbed()
      .setTitle(`📃 Queue of __${guild.name}__  -  [ ${newQueue.songs.length} Tracks ]`)
      .setColor(ee.color)
      .setDescription(String(songs.map((track, index) => `**\` ${++index}. \` ${track.url ? `[${track.name.substr(0, 60).replace(/\[/igu, `\\[`).replace(/\]/igu, `\\]`)}](${track.url})` : track.name}** - \`${track.isStream ? `LIVE STREAM` : track.formattedDuration}\`\n> *Requested by: __${track.user?.tag}__*`).join(`\n`)).substr(0, 2048));
      if(newQueue.songs.length > 10)
        embeds[0].addField(`**\` N. \` *${newQueue.songs.length > maxTracks ? newQueue.songs.length - maxTracks : newQueue.songs.length} other Tracks ...***`, `\u200b`)
      embeds[0].addField(`**\` 0. \` __CURRENT TRACK__**`, `**${newQueue.songs[0].url ? `[${newQueue.songs[0].name.substr(0, 60).replace(/\[/igu, `\\[`).replace(/\]/igu, `\\]`)}](${newQueue.songs[0].url})`:newQueue.songs[0].name}** - \`${newQueue.songs[0].isStream ? `LIVE STREAM` : newQueue.formattedCurrentTime}\`\n> *Requested by: __${newQueue.songs[0].user?.tag}__*`)
    }
    var Emojis = [
      `0️⃣`,
      `1️⃣`,
      `2️⃣`,
      `3️⃣`,
      `4️⃣`,
      `5️⃣`,
      `6️⃣`,
      `7️⃣`,
      `8️⃣`,
      `9️⃣`,
      `🔟`,
      `🟥`,
      `🟧`,
      `🟨`,
      `🟩`,
      `🟦`,
      `🟪`,
      `🟫`,
    ]
    //now we add the components!
    var musicmixMenu = new MessageSelectMenu()
      .setCustomId(`MessageSelectMenu`)
      .addOptions([`Pop`, `Strange-Fruits`, `Gaming`, `Chill`, `Rock`, `Jazz`, `Blues`, `Metal`, `Magic-Release`, `NCS | No Copyright Music`, `Default`].map((t, index) => {
        return {
          label: t.substr(0, 25),
          value: t.substr(0, 25),
          description: `Load a Music-Playlist: '${t}'`.substr(0, 50),
          emoji: Emojis[index]
        }
      }))
    var stopbutton = new MessageButton().setStyle('DANGER').setCustomId('Stop').setEmoji(`🏠`).setLabel(`Stop`).setDisabled()
    var skipbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Skip').setEmoji(`⏭`).setLabel(`Skip`).setDisabled();
    var shufflebutton = new MessageButton().setStyle('PRIMARY').setCustomId('Shuffle').setEmoji('🔀').setLabel(`Shuffle`).setDisabled();
    var pausebutton = new MessageButton().setStyle('SECONDARY').setCustomId('Pause').setEmoji('⏸').setLabel(`Pause`).setDisabled();
    var autoplaybutton = new MessageButton().setStyle('SUCCESS').setCustomId('Autoplay').setEmoji('🔁').setLabel(`Autoplay`).setDisabled();
    var songbutton = new MessageButton().setStyle('SUCCESS').setCustomId('Song').setEmoji(`🔁`).setLabel(`Song`).setDisabled();
    var queuebutton = new MessageButton().setStyle('SUCCESS').setCustomId('Queue').setEmoji(`🔂`).setLabel(`Queue`).setDisabled();
    var forwardbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Forward').setEmoji('⏩').setLabel(`+10 Sec`).setDisabled();
    var rewindbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Rewind').setEmoji('⏪').setLabel(`-10 Sec`).setDisabled();
    var lyricsbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Lyrics').setEmoji('📝').setLabel(`Lyrics`).setDisabled();
    if (!leave && newQueue && newQueue.songs[0]) {
      skipbutton = skipbutton.setDisabled(false);
      shufflebutton = shufflebutton.setDisabled(false);
      stopbutton = stopbutton.setDisabled(false);
      songbutton = songbutton.setDisabled(false);
      queuebutton = queuebutton.setDisabled(false);
      forwardbutton = forwardbutton.setDisabled(false);
      rewindbutton = rewindbutton.setDisabled(false);
      autoplaybutton = autoplaybutton.setDisabled(false)
      pausebutton = pausebutton.setDisabled(false)
      if (newQueue.autoplay) {
        autoplaybutton = autoplaybutton.setStyle('SECONDARY')
      }
      if (newQueue.paused) {
        pausebutton = pausebutton.setStyle('SUCCESS').setEmoji('▶️').setLabel(`Resume`)
      }
      switch(newQueue.repeatMode) {
        default: { // == 0
          songbutton = songbutton.setStyle('SUCCESS')
          queuebutton = queuebutton.setStyle('SUCCESS')
        }break;
        case 1: {
          songbutton = songbutton.setStyle('SECONDARY')
          queuebutton = queuebutton.setStyle('SUCCESS')
        }break;
        case 2: {
          songbutton = songbutton.setStyle('SUCCESS')
          queuebutton = queuebutton.setStyle('SECONDARY')
        }break;
      }
    }
    //now we add the components!
    var components = [
      new MessageActionRow().addComponents([
        musicmixMenu
      ]),
      new MessageActionRow().addComponents([
        skipbutton,
        stopbutton,
        pausebutton,
        autoplaybutton,
        shufflebutton,
      ]),
      new MessageActionRow().addComponents([
        songbutton,
        queuebutton,
        forwardbutton,
        rewindbutton,
        lyricsbutton,
      ]),
    ]
    return {
      embeds,
      components
    }
  }
  //for normal tracks
  function receiveQueueData(newQueue, newTrack) {
    if(!newQueue) return new MessageEmbed().setColor(ee.wrongcolor).setTitle(`NO SONG FOUND?!?!`)
    var djs = client.settings.get(newQueue.id, `djroles`);
    if(!djs || !Array.isArray(djs)) djs = [];
    else djs = djs.map(r => `<@&${r}>`);
    if(djs.length == 0 ) djs = `\`not setup\``;
    else djs.slice(0, 15).join(`, `);
    if(!newTrack) return new MessageEmbed().setColor(ee.wrongcolor).setTitle(`NO SONG FOUND?!?!`)
    var embed = new MessageEmbed().setColor(ee.color)
      .setDescription(`See the [Queue on the **DASHBOARD** Live!](${require(`../dashboard/settings.json`).website.domain}/queue/${newQueue.id})`)
      .addField(`💡 Requested by:`, `>>> ${newTrack.user}`, true)
      .addField(`⏱ Duration:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
      .addField(`🌀 Queue:`, `>>> \`${newQueue.songs.length} song(s)\`\n\`${newQueue.formattedDuration}\``, true)
      .addField(`🔊 Volume:`, `>>> \`${newQueue.volume} %\``, true)
      .addField(`♾ Loop:`, `>>> ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `${client.allEmojis.check_mark}\` Queue\`` : `${client.allEmojis.check_mark} \`Song\`` : `${client.allEmojis.x}`}`, true)
      .addField(`↪️ Autoplay:`, `>>> ${newQueue.autoplay ? `${client.allEmojis.check_mark}` : `${client.allEmojis.x}`}`, true)
      .addField(`❔ Download Song:`, `>>> [\`Click here\`](${newTrack.streamURL})`, true)
      .addField(`❔ Filter${newQueue.filters.length > 0 ? `s`: ``}:`, `>>> ${newQueue.filters && newQueue.filters.length > 0 ? `${newQueue.filters.map(f=>`\`${f}\``).join(`, `)}` : `${client.allEmojis.x}`}`, newQueue.filters.length > 1 ? false : true)
			.addField(`🎧 DJ-Role${client.settings.get(newQueue.id, `djroles`).length > 1 ? `s`: ``}:`, `>>> ${djs}`, client.settings.get(newQueue.id, `djroles`).length > 1 ? false : true)
      .setAuthor(`${newTrack.name}`, `https://images-ext-1.discordapp.net/external/DkPCBVBHBDJC8xHHCF2G7-rJXnTwj_qs78udThL8Cy0/%3Fv%3D1/https/cdn.discordapp.com/emojis/859459305152708630.gif`, newTrack.url)
      .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
      .setFooter(`💯 ${newTrack.user.tag}`, newTrack.user.displayAvatarURL({
        dynamic: true
      }));
    let skip = new MessageButton().setStyle('PRIMARY').setCustomId('1').setEmoji(`⏭`).setLabel(`Skip`)
    let stop = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji(`🏠`).setLabel(`Stop`)
    let pause = new MessageButton().setStyle('SECONDARY').setCustomId('3').setEmoji('⏸').setLabel(`Pause`)
    let autoplay = new MessageButton().setStyle('SUCCESS').setCustomId('4').setEmoji('🔁').setLabel(`Autoplay`)
    let shuffle = new MessageButton().setStyle('PRIMARY').setCustomId('5').setEmoji('🔀').setLabel(`Shuffle`)
    if (!newQueue.playing) {
      pause = pause.setStyle('SUCCESS').setEmoji('▶️').setLabel(`Resume`)
    }
    if (newQueue.autoplay) {
      autoplay = autoplay.setStyle('SECONDARY')
    }
    let songloop = new MessageButton().setStyle('SUCCESS').setCustomId('6').setEmoji(`🔁`).setLabel(`Song`)
    let queueloop = new MessageButton().setStyle('SUCCESS').setCustomId('7').setEmoji(`🔂`).setLabel(`Queue`)
    let forward = new MessageButton().setStyle('PRIMARY').setCustomId('8').setEmoji('⏩').setLabel(`+10 Sec`)
    let rewind = new MessageButton().setStyle('PRIMARY').setCustomId('9').setEmoji('⏪').setLabel(`-10 Sec`)
    let lyrics = new MessageButton().setStyle('PRIMARY').setCustomId('10').setEmoji('📝').setLabel(`Lyrics`).setDisabled();
    if (newQueue.repeatMode === 0) {
      songloop = songloop.setStyle('SUCCESS')
      queueloop = queueloop.setStyle('SUCCESS')
    }
    if (newQueue.repeatMode === 1) {
      songloop = songloop.setStyle('SECONDARY')
      queueloop = queueloop.setStyle('SUCCESS')
    }
    if (newQueue.repeatMode === 2) {
      songloop = songloop.setStyle('SUCCESS')
      queueloop = queueloop.setStyle('SECONDARY')
    }
    if (Math.floor(newQueue.currentTime) < 10) {
      rewind = rewind.setDisabled()
    } else {
      rewind = rewind.setDisabled(false)
    }
    if (Math.floor((newTrack.duration - newQueue.currentTime)) <= 10) {
      forward = forward.setDisabled()
    } else {
      forward = forward.setDisabled(false)
    }
    const row = new MessageActionRow().addComponents([skip, stop, pause, autoplay, shuffle]);
    const row2 = new MessageActionRow().addComponents([songloop, queueloop, forward, rewind, lyrics]);
    return {
      embeds: [embed],
      components: [row, row2]
    };
  }
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch {
    return str
  }
}
