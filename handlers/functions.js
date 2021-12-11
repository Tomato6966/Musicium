const {
    MessageEmbed,
    Collection
  } = require("discord.js");
  const Discord = require("discord.js")
  const config = require("../botconfig/config.json");
  const ee = require("../botconfig/embed.json");
  const settings = require("../botconfig/settings.json");
  //EXPORT ALL FUNCTIONS
  module.exports.nFormatter = nFormatter;
  module.exports.change_status = change_status;
  module.exports.shuffle = shuffle;
  module.exports.formatDate = formatDate;
  module.exports.delay = delay;
  module.exports.getRandomInt = getRandomInt;
  module.exports.duration = duration;
  module.exports.getRandomNum = getRandomNum;
  module.exports.createBar = createBar;
  module.exports.format = format;
  module.exports.swap_pages = swap_pages;
  module.exports.swap_pages2 = swap_pages2;
  module.exports.escapeRegex = escapeRegex;
  module.exports.arrayMove = arrayMove;
  module.exports.isValidURL = isValidURL;
  module.exports.GetUser = GetUser;
  module.exports.GetRole = GetRole;
  module.exports.GetGlobalUser = GetGlobalUser;
  module.exports.parseMilliseconds = parseMilliseconds;
  module.exports.onCoolDown = onCoolDown;

module.exports.formatDate = formatDate;
module.exports.customplaylistembed = customplaylistembed;
module.exports.check_if_dj = check_if_dj;

function check_if_dj(client, member, song) {
    //if no message added return
    if(!client) return false;
    //get the adminroles
    var roleid = client.settings.get(member.guild.id, `djroles`)
    //if no dj roles return false, so that it continues
    if (String(roleid) == "") return false;

    //define variables
    var isdj = false;

    //loop through the roles
    for (let i = 0; i < roleid.length; i++) {
        //if the role does not exist, then skip this current loop run
        if (!member.guild.roles.cache.get(roleid[i])) continue;
        //if he has role set var to true
        if (member.roles.cache.has(roleid[i])) isdj = true;
        //add the role to the string
    }
    //if no dj and not an admin, return the string
    if (!isdj && !member.permissions.has("ADMINISTRATOR") && song.user.id != member.id)
        return roleid.map(i=>`<@&${i}>`).join(", ");
    //if he is a dj or admin, then return false, which will continue the cmd
    else
        return false;
}

function customplaylistembed(lyrics, song) {
    if (!lyrics) lyrics = "No Songs in the playlist!";
    try {
        let embeds = [];
        let k = 1000;
        for (let i = 0; i < lyrics.length; i += 1000) {
            const current = lyrics.slice(i, k);
            k += 1000;
            const embed = new Discord.MessageEmbed()
                .setTitle("Custom Playlist")
                .setColor(config.colors.yes)
                .setDescription(current)
            embeds.push(embed);
        }
        return embeds;
    } catch (error) {
        console.log(error)
    }
}

  module.exports.replacemsg = replacedefaultmessages
  /**
   * 
   * @param {*} text The Text that should be replaced, usually from /botconfig/settings.json
   * @param {*} options Those Options are what are needed for the replaceMent! Valid ones are: { 
   *   timeLeft: "",
   *   commandmemberpermissions: { memberpermissions: [] }, 
   *   commandalloweduserids: { alloweduserids: [] }, 
   *   commandrequiredroles: { requiredroles: [] }, 
   *   commandname: { name: "" }, 
   *   commandaliases: { aliases: [] }, 
   *   prefix: "",
   *   errormessage: { message: "" }
   *   errorstack: { stack: STACK }
   *   error: ERRORTYPE
   * }
   * @returns STRING
   */
  function replacedefaultmessages(text, o = {}){
      if(!text || text == undefined || text == null) throw "No Text for the replacedefault message added as First Parameter";
      const options = Object(o)
      if(!options || options == undefined || options == null) return String(text)
      return String(text)
        .replace(/%{timeleft}%/gi, options && options.timeLeft ? options.timeLeft.toFixed(1) : "%{timeleft}%")
        .replace(/%{commandname}%/gi, options && options.command && options.command.name ? options.command.name : "%{commandname}%")
        .replace(/%{commandaliases}%/gi, options && options.command && options.command.aliases ? options.command.aliases.map(v => `\`${v}\``).join(",") : "%{commandaliases}%")
        .replace(/%{prefix}%/gi, options && options.prefix ? options.prefix : "%{prefix}%")
        .replace(/%{commandmemberpermissions}%/gi, options && options.command && options.command.memberpermissions ? options.command.memberpermissions.map(v => `\`${v}\``).join(",") : "%{commandmemberpermissions}%")
        .replace(/%{commandalloweduserids}%/gi, options && options.command &&options.command.alloweduserids ? options.command.alloweduserids.map(v => `<@${v}>`).join(",") : "%{commandalloweduserids}%")
        .replace(/%{commandrequiredroles}%/gi, options && options.command &&options.command.requiredroles ? options.command.requiredroles.map(v => `<@&${v}>`).join(",") : "%{commandrequiredroles}%")
        .replace(/%{errormessage}%/gi, options && options.error && options.error.message ? options.error.message : options && options.error ? options.error : "%{errormessage}%")
        .replace(/%{errorstack}%/gi, options && options.error && options.error.stack ? options.error.stack : options && options.error && options.error.message ? options.error.message : options && options.error ? options.error : "%{errorstack}%")
        .replace(/%{error}%/gi, options && options.error ? options.error : "%{error}%")
  }
  
  /**
   * 
   * @param {*} message A DiscordMessage, with the client, information
   * @param {*} command The Command with the command.name
   * @returns BOOLEAN
   */
  
function onCoolDown(message, command) {
    if(!message || !message.client) throw "No Message with a valid DiscordClient granted as First Parameter";
    if(!command || !command.name) throw "No Command with a valid Name granted as Second Parameter";
    const client = message.client;
    if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
      client.cooldowns.set(command.name, new Collection());
    }
    const now = Date.now(); //get the current time
    const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
    const cooldownAmount = (command.cooldown || settings.default_cooldown_in_sec) * 1000; //get the cooldownamount of the command, if there is no cooldown there will be automatically 1 sec cooldown, so you cannot spam it^^
    if (timestamps.has(message.member.id)) { //if the user is on cooldown
      const expirationTime = timestamps.get(message.member.id) + cooldownAmount; //get the amount of time he needs to wait until he can run the cmd again
      if (now < expirationTime) { //if he is still on cooldonw
        const timeLeft = (expirationTime - now) / 1000; //get the lefttime
        //return true
        return timeLeft
      }
      else {
        //if he is not on cooldown, set it to the cooldown
        timestamps.set(message.member.id, now); 
        //set a timeout function with the cooldown, so it gets deleted later on again
        setTimeout(() => timestamps.delete(message.member.id), cooldownAmount); 
        //return false aka not on cooldown
        return false;
      }
    }
    else {
      //if he is not on cooldown, set it to the cooldown
      timestamps.set(message.member.id, now); 
      //set a timeout function with the cooldown, so it gets deleted later on again
      setTimeout(() => timestamps.delete(message.member.id), cooldownAmount); 
      //return false aka not on cooldown
      return false;
    }
  }
  
  /**
   * 
   * @param {*} milliseconds NUMBER | TIME IN MILLISECONDS
   * @returns Object of Formatted Time in Days to nanoseconds
   */
  function parseMilliseconds(milliseconds) {
      if (typeof milliseconds !== 'number') {
          throw new TypeError('Expected a number');
      }
  
      return {
          days: Math.trunc(milliseconds / 86400000),
          hours: Math.trunc(milliseconds / 3600000) % 24,
          minutes: Math.trunc(milliseconds / 60000) % 60,
          seconds: Math.trunc(milliseconds / 1000) % 60,
          milliseconds: Math.trunc(milliseconds) % 1000,
          microseconds: Math.trunc(milliseconds * 1000) % 1000,
          nanoseconds: Math.trunc(milliseconds * 1e6) % 1000
      };
  }
  
  /**
   * 
   * @param {*} string A WHOLE TEXT, checks if there is a URL IN IT
   * @returns BOOLEAN/THE URL
   */
  function isValidURL(string) {
    const args = string.split(" ");
    let url;
    for(const arg of args){
      try {
        url = new URL(arg);
        url = url.protocol === "http:" || url.protocol === "https:";
        break;
      } catch (_) {
        url = false;
      }
    }
    return url;
  };
  
  /**
   * 
   * @param {*} message a DISCORDMESSAGE with the Content and guild and client information
   * @param {*} arg //a argument, for search for example
   * @returns BOOLEAN/DISCORDUSER
   */
  function GetUser(message, arg){
    var errormessage = ":x: I failed finding that User...";
    return new Promise(async (resolve, reject) => {
      var args = arg, client = message.client;
      if(!client || !message) return reject("CLIENT IS NOT DEFINED")
      if(!args || args == null || args == undefined) args = message.content.trim().split(/ +/).slice(1);
      let user = message.mentions.users.first();
      if(!user && args[0] && args[0].length == 18) {
        user = await client.users.fetch(args[0])
        if(!user) return reject(errormessage)
        return resolve(user);
      }
      else if(!user && args[0]){
        let alluser = message.guild.members.cache.map(member=> String(member.user.tag).toLowerCase())
        user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
        user = message.guild.members.cache.find(me => String(me.user.tag).toLowerCase() == user)
        if(!user || user == null || !user.id) {
          alluser = message.guild.members.cache.map(member => String(member.displayName + "#" + member.user.discriminator).toLowerCase())
          user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
          user = message.guild.members.cache.find(me => String(me.displayName + "#" + me.user.discriminator).toLowerCase() == user)
          if(!user || user == null || !user.id) return reject(errormessage)
        }
        user = await client.users.fetch(user.user.id)
        if(!user) return reject(errormessage)
        return resolve(user);
      }
      else {
        user = message.mentions.users.first() || message.author;
        return resolve(user);
      }
    })
  }
  
  /**
   * 
   * @param {*} message a DISCORDMESSAGE with the Content and guild and client information
   * @param {*} arg //a argument, for search for example
   * @returns BOOLEAN/GUILDROLE
   */
  function GetRole(message, arg){
    var errormessage = ":x: I failed finding that Role...";
    return new Promise(async (resolve, reject) => {
      var args = arg, client = message.client;
      if(!client || !message) return reject("CLIENT IS NOT DEFINED")
      if(!args || args == null || args == undefined) args = message.content.trim().split(/ +/).slice(1);
      let user = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
      if(!user && args[0] && args[0].length == 18) {
        user = message.guild.roles.cache.get(args[0])
        if(!user) return reject(errormessage)
        return resolve(user);
      }
      else if(!user && args[0]){
        let alluser = message.guild.roles.cache.map(role => String(role.name).toLowerCase())
        user = alluser.find(r => r.split(" ").join("").includes(args.join("").toLowerCase()))
        user = message.guild.roles.cache.find(role => String(role.name).toLowerCase() === user)
        if(!user) return reject(errormessage)
        return resolve(user);
      }
      else {
        user = message.mentions.roles.filter(role=>role.guild.id==message.guild.id).first();
        if(!user) return reject(errormessage)
        return resolve(user);
      }
    })
  }
  
  
  /**
   * 
   * @param {*} message a DISCORDMESSAGE with the Content and guild and client information
   * @param {*} arg //a argument, for search for example
   * @returns BOOLEAN/DISCORDUSER
   */
  function GetGlobalUser(message, arg){
    var errormessage = ":x: I failed finding that User...";
    return new Promise(async (resolve, reject) => {
      var args = arg, client = message.client;
      if(!client || !message) return reject("CLIENT IS NOT DEFINED")
      if(!args || args == null || args == undefined) args = message.content.trim().split(/ +/).slice(1);
      let user = message.mentions.users.first();
      if(!user && args[0] && args[0].length == 18) {
        user = await client.users.fetch(args[0])
        if(!user) return reject(errormessage)
        return resolve(user);
      }
      else if(!user && args[0]){
        let alluser = [], allmembers = [];
        var guilds = Array.from(client.guilds.cache.values())
        for(const g of guilds){
          var members = Array.from(g.members.cache.values());
          for(const m of members) { alluser.push(m.user.tag); allmembers.push(m); }
        }
        user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
        user = allmembers.find(me => String(me.user.tag).toLowerCase() == user)
        if(!user || user == null || !user.id) {
          user = alluser.find(user => user.startsWith(args.join(" ").toLowerCase()))
          user = allmembers.find(me => String(me.displayName + "#" + me.user.discriminator).toLowerCase() == user)
          if(!user || user == null || !user.id) return reject(errormessage)
        }
        user = await client.users.fetch(user.user.id)
        if(!user) return reject(errormessage)
        return resolve(user);
      }
      else {
        user = message.mentions.users.first() || message.author;
        return resolve(user);
      }
    })
  }
  
  /**
   * 
   * @param {*} array Shuffles a given array (mix) 
   * @returns ARRAY
   */
  function shuffle(array) {
    try {
      var j, x, i;
      for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
      }
      return array;
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
  
  /**
   * 
   * @param {*} date Date format (Date.now())
   * @returns Formatted Date
   */
  function formatDate(date) {
    try {
      return new Intl.DateTimeFormat("en-US").format(date);
    } catch (e) {
      console.log(String(e.stack).bgRed)
      return false;
    }
  }
  
  /**
   * 
   * @param {*} duration Number | Time in Milliseconds
   * @returns Object of Formatted Time in Days to milliseconds
   */
  function parseDuration(duration) {
    let remain = duration
    let days = Math.floor(remain / (1000 * 60 * 60 * 24))
    remain = remain % (1000 * 60 * 60 * 24)
  
    let hours = Math.floor(remain / (1000 * 60 * 60))
    remain = remain % (1000 * 60 * 60)
  
    let minutes = Math.floor(remain / (1000 * 60))
    remain = remain % (1000 * 60)
  
    let seconds = Math.floor(remain / (1000))
    remain = remain % (1000)
  
    let milliseconds = remain
  
    return {
      days,
      hours,
      minutes,
      seconds,
      milliseconds
    };
  }
  
  /**
   * 
   * @param {*} o Object of Time from days to nanoseconds/milliseconds
   * @param {*} useMilli Optional Boolean parameter, if it should use milliseconds or not in the showof
   * @returns Formatted Time
   */
  function formatTime(o, useMilli = false) {
    let parts = []
    if (o.days) {
      let ret = o.days + ' Day'
      if (o.days !== 1) {
        ret += 's'
      }
      parts.push(ret)
    }
    if (o.hours) {
      let ret = o.hours + ' Hr'
      if (o.hours !== 1) {
        ret += 's'
      }
      parts.push(ret)
    }
    if (o.minutes) {
      let ret = o.minutes + ' Min'
      if (o.minutes !== 1) {
        ret += 's'
      }
      parts.push(ret)
  
    }
    if (o.seconds) {
      let ret = o.seconds + ' Sec'
      if (o.seconds !== 1) {
        ret += 's'
      }
      parts.push(ret)
    }
    if (useMilli && o.milliseconds) {
      let ret = o.milliseconds + ' ms'
      parts.push(ret)
    }
    if (parts.length === 0) {
      return 'instantly'
    } else {
      return parts
    }
  }
  
  /**
   * 
   * @param {*} duration Number | Time in Millisceonds
   * @param {*} useMilli Optional Boolean parameter, if it should use milliseconds or not in the showof
   * @returns Formatted Time
   */
  function duration(duration, useMilli = false) {
    let time = parseDuration(duration)
    return formatTime(time, useMilli)
  }
  
  /**
   * 
   * @param {*} delayInms Number | Time in Milliseconds
   * @returns Promise, waiting for the given Milliseconds
   */
  function delay(delayInms) {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(2);
        }, delayInms);
      });
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
  
  /**
   * 
   * @param {*} max Number | 0 - MAX
   * @returns Number
   */
  function getRandomInt(max) {
    try {
      return Math.floor(Math.random() * Math.floor(max));
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
  
  /**
   * 
   * @param {*} min Number | min - max
   * @param {*} max Number | min - max
   * @returns Number
   */
  function getRandomNum(min, max) {
    try {
      return Math.floor(Math.random() * Math.floor((max - min) + min));
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
  
  /**
   * 
   * @param {*} total Number | Time in Milliseconds
   * @param {*} current  Number | Time in Milliseconds | Current Music Position
   * @param {*} size Number | Amount of Letters in the Bar (SIZE) Default is: 25
   * @param {*} line EMOJI | the default line is: "▬"
   * @param {*} slider EMOJI | the default slider is: "🔷"
   * @returns STRING a BAR [▬▬▬▬▬🔷▬▬▬▬▬▬▬▬]
   */
  function createBar(total, current, size = 25, line = "▬", slider = "🔷") {
    try {
      if (!total) throw "MISSING MAX TIME";
      if (!current) return `**[${slider}${line.repeat(size - 1)}]**`;
      let bar = current > total 
          ? [line.repeat(size / 2 * 2), (current / total) * 100] 
          : [line.repeat(Math.round(size / 2 * (current / total))).replace(/.$/, slider) 
            + line.repeat(size - Math.round(size * (current / total)) + 1), current / total];
      if (!String(bar).includes(slider)) {
        return `**[${slider}${line.repeat(size - 1)}]**`;
      } else{
        return `**[${bar[0]}]**`;
      }
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
  
  /**
   * 
   * @param {*} millis Number | Time in Milliseconds 
   * @returns Formatted time in: HH:MM:SS HH only if bigger then 0
   */
  function format(millis) {
    try {
      var h = Math.floor(millis / 3600000),
        m = Math.floor(millis / 60000),
        s = ((millis % 60000) / 1000).toFixed(0);
      if (h < 1) return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
      else return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
  
  /**
   * 
   * @param {*} str String of message, not replacing pings 
   * @returns Only the Pinged message
   */
  function escapeRegex(str) {
    try {
      return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
  
  /**
   * 
   * @param {*} array ARRAY | Complete Array to work with 
   * @param {*} from NUMBER | Position of first ITEM
   * @param {*} to NUMBER | Position where to move it to
   * @returns ARRAY | the Moved Array
   */
  function arrayMove(array, from, to) {
    try {
      array = [...array];
      const startIndex = from < 0 ? array.length + from : from;
      if (startIndex >= 0 && startIndex < array.length) {
        const endIndex = to < 0 ? array.length + to : to;
        const [item] = array.splice(from, 1);
        array.splice(endIndex, 0, item);
      }
      return array;
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
  
  /**
   * 
   * @param {*} num Number
   * @param {*} digits How many digits it should have: 10.231k == 3
   * @returns Formatted Number
   */
  function nFormatter(num, digits = 2) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }
  
  /**
   * @param {*} message Discord Message with a DiscordChannel (TEXTCHANNEL)
   * @param {*} desc A Description, STRING OR ARRAY
   * @param {*} TITLE Title of the Embed
   * @param {*} reactionemojis Emojis for swaping the pages, Default: ["⬅️", "⏹", "➡️"] | OPTIONAL
   * @param {*} sliceamount If an Array is beeing used, it is the amount of items, per page, if a string then the amount of letters per page, Default Array: 15, Default String: 1000 | OPTIONAL
   * @returns VOID, works by itself
   */
   const { MessageButton, MessageActionRow } = require('discord.js')
   async function swap_pages(client, message, description, TITLE) {
     let prefix = config.prefix;
     let cmduser = message.author;
   
     let currentPage = 0;
     //GET ALL EMBEDS
     let embeds = [];
     //if input is an array
     if (Array.isArray(description)) {
       try {
         let k = 20;
         for (let i = 0; i < description.length; i += 20) {
           const current = description.slice(i, k);
           k += 20;
           const embed = new MessageEmbed()
             .setDescription(current)
             .setTitle(TITLE)
             .setColor(ee.color)
             .setFooter(ee.footertext, ee.footericon)
           embeds.push(embed);
         }
         embeds;
       } catch {}
     } else {
       try {
         let k = 1000;
         for (let i = 0; i < description.length; i += 1000) {
           const current = description.slice(i, k);
           k += 1000;
           const embed = new MessageEmbed()
             .setDescription(current)
             .setTitle(TITLE)
             .setColor(ee.color)
             .setFooter(ee.footertext, ee.footericon)
           embeds.push(embed);
         }
         embeds;
       } catch {}
     }
     if (embeds.length === 0) return message.channel.send({embeds: [new MessageEmbed()
     .setTitle(`${emoji.msg.ERROR} No Content added to the SWAP PAGES Function`)
     .setColor(ee.wrongcolor)
     .setFooter(ee.footertext, ee.footericon)]}).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
     if (embeds.length === 1) return message.channel.send({embeds: [embeds[0]]}).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
   
     let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("833802907509719130").setLabel("Back")
     let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel("Home")
     let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('832598861813776394').setLabel("Forward")
     const allbuttons = [new MessageActionRow().addComponents([button_back, button_home, button_forward])]
     //Send message with buttons
     let swapmsg = await message.channel.send({   
         content: `***Click on the __Buttons__ to swap the Pages***`,
         embeds: [embeds[0]], 
         components: allbuttons
     });
     //create a collector for the thinggy
     const collector = swapmsg.createMessageComponentCollector({filter: (i) => i.isButton() && i.user && i.user.id == cmduser.id && i.message.author.id == client.user.id, time: 180e3 }); //collector for 5 seconds
     //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
     collector.on('collect', async b => {
         if(b.user.id !== message.author.id)
           return b.reply(`<:declined:780403017160982538> **Only the one who typed ${prefix}help is allowed to react!**`, true)
           //page forward
           if(b.customId == "1") {
             //b.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
               if (currentPage !== 0) {
                 currentPage -= 1
                 await swapmsg.edit({embeds: [embeds[currentPage]], components: allbuttons});
                 await b.deferUpdate();
               } else {
                   currentPage = embeds.length - 1
                   await swapmsg.edit({embeds: [embeds[currentPage]], components: allbuttons});
                   await b.deferUpdate();
               }
           }
           //go home
           else if(b.customId == "2"){
             //b.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
               currentPage = 0;
               await swapmsg.edit({embeds: [embeds[currentPage]], components: allbuttons});
               await b.deferUpdate();
           } 
           //go forward
           else if(b.customId == "3"){
             //b.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
               if (currentPage < embeds.length - 1) {
                   currentPage++;
                   await swapmsg.edit({embeds: [embeds[currentPage]], components: allbuttons});
                   await b.deferUpdate();
               } else {
                   currentPage = 0
                   await swapmsg.edit({embeds: [embeds[currentPage]], components: allbuttons});
                   await b.deferUpdate();
               }
           
         }
     });
   
   
   }
   async function swap_pages2(client, message, embeds) {
     let currentPage = 0;
     let cmduser = message.author;
     if (embeds.length === 1) return message.channel.send({embeds: [embeds[0]]}).catch(e => console.log("THIS IS TO PREVENT A CRASH"))
     let button_back = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji("833802907509719130").setLabel("Back")
     let button_home = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji("🏠").setLabel("Home")
     let button_forward = new MessageButton().setStyle('SUCCESS').setCustomId('3').setEmoji('832598861813776394').setLabel("Forward")
     const allbuttons = [new MessageActionRow().addComponents([button_back, button_home, button_forward])]
     let prefix = client.settings.get(message.guild.id, "prefix");
     //Send message with buttons
     let swapmsg = await message.channel.send({   
         content: `***Click on the __Buttons__ to swap the Pages***`,
         embeds: [embeds[0]], 
         components: allbuttons
     });
     //create a collector for the thinggy
     const collector = swapmsg.createMessageComponentCollector({filter: (i) => i.isButton() && i.user && i.user.id == cmduser.id && i.message.author.id == client.user.id, time: 180e3 }); //collector for 5 seconds
     //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
     collector.on('collect', async b => {
         if(b.user.id !== message.author.id)
           return b.reply(`<:declined:780403017160982538> **Only the one who typed ${prefix}help is allowed to react!**`, true)
           //page forward
           if(b.customId == "1") {
             //b.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
               if (currentPage !== 0) {
                 currentPage -= 1
                 await swapmsg.edit({embeds: [embeds[currentPage]], components: allbuttons});
                 await b.deferUpdate();
               } else {
                   currentPage = embeds.length - 1
                   await swapmsg.edit({embeds: [embeds[currentPage]], components: allbuttons});
                   await b.deferUpdate();
               }
           }
           //go home
           else if(b.customId == "2"){
             //b.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
               currentPage = 0;
               await swapmsg.edit({embeds: [embeds[currentPage]], components: allbuttons});
               await b.deferUpdate();
           } 
           //go forward
           else if(b.customId == "3"){
             //b.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
               if (currentPage < embeds.length - 1) {
                   currentPage++;
                   await swapmsg.edit({embeds: [embeds[currentPage]], components: allbuttons});
                   await b.deferUpdate();
               } else {
                   currentPage = 0
                   await swapmsg.edit({embeds: [embeds[currentPage]], components: allbuttons});
                   await b.deferUpdate();
               }
           
         }
     });
   
   }
  
  /**
   * 
   * @param {*} client Discord Client
   * Function to Change the Status 
   */
  function change_status(client) {
    try {
      client.user.setActivity(`${config.prefix}help | ${client.guilds.cache.size} Guilds | ${Math.ceil(client.users.cache.size/1000)}k Members`, {
        type: "PLAYING",
      });
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
