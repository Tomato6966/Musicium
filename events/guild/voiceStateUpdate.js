module.exports = async (client, oldState, newState) => {
    if (
        (!oldState.streaming && newState.streaming)   ||
        (oldState.streaming && !newState.streaming)   ||
        (!oldState.serverDeaf && newState.serverDeaf) ||
        (oldState.serverDeaf && !newState.serverDeaf) ||
        (!oldState.serverMute && newState.serverMute) ||
        (oldState.serverMute && !newState.serverMute) || 
        (!oldState.selfDeaf && newState.selfDeaf)     ||
        (oldState.selfDeaf && !newState.selfDeaf)     ||
        (!oldState.selfMute && newState.selfMute)     ||
        (oldState.selfMute && !newState.selfMute)     ||
        (!oldState.selfVideo && newState.selfVideo)   ||
        (oldState.selfVideo && !newState.selfVideo) 
     )
    if (!oldState.channelId && newState.channelId) {
        if(newState.channel.type == "GUILD_STAGE_VOICE" && newState.guild.me.voice.suppress){
          try{
            await newState.guild.me.voice.setSuppressed(false);
          }catch (e){
            console.log(String(e).grey)
          }
        }
        return
    }
    if (oldState.channelId && !newState.channelId) {
        return
    }
    if (oldState.channelId && newState.channelId) {
        if(newState.channel.type == "GUILD_STAGE_VOICE" && newState.guild.me.voice.suppress){
          try{
            await newState.guild.me.voice.setSuppressed(false);
          }catch (e){
            console.log(String(e).grey)
          }
        }
        return;
    }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */