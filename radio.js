  ////////////////////////////
  //////CONFIG LOAD///////////
  ////////////////////////////
  const {
      MessageEmbed
  } = require("discord.js");
  const Discord = require("discord.js");
  const config = require("./config.json")
  //all radio stations
  const {
      Radiostations
  } = require("./radiostations.json")
  const radios = require("./radiostations.json")
  const paginationEmbed = require("discord.js-pagination")
  ////////////////////////////
  //////COMMAND BEGIN/////////
  ////////////////////////////
  module.exports = async function (client, message, args) {
      //get the prefix
      let prefix = client.settings.get(message.guild.id, `prefix`);
      if (prefix === null) prefix = config.prefix; //if not prefix set it to standard prefix in the config.json file

      //LINKS
      if (!args[0])
          return stations(client, prefix, message);

      let {
          channel
      } = message.member.voice;
      if (!channel) return message.reply("Please join a Channel first!")

      if (isNaN(args[0])) {
          return message.reply(
              new Discord.MessageEmbed()
              .setColor("RED")
              .setAuthor(`Error`, client.user.displayAvatarURL(), "https://24.musicium.eu")
              .setFooter(client.user.username, client.user.displayAvatarURL())
              .setTitle(`Not a valid radio station please use a Number between \`1\` and \`${Radiostations.length}\``)
          );
      }
      if (Number(args[1]) > 150) return message.reply("**Maximum Volume is `150`!**")
      if (Number(args[1]) < 1) return message.reply("**Minimum Volume is `1`!**")
      let volume;
      if (isNaN(args[1])) {
          volume = 50;
      } else {
          volume = args[1]
      }
      let args2;

      if (Number([args[0]]) > 0 && Number(args[0]) <= 10)
          args2 = radios.EU.United_Kingdom[Number(args[0]) - 1].split(` `);
      else if (Number([args[0]]) > 10 && Number(args[0]) <= 20)
          args2 = radios.EU.Austria[Number(args[0]) - 10 - 1].split(` `);
      else if (Number([args[0]]) > 20 && Number(args[0]) <= 30)
          args2 = radios.EU.Belgium[Number(args[0]) - 20 - 1].split(` `);
      else if (Number([args[0]]) > 30 && Number(args[0]) <= 40)
          args2 = radios.EU.Bosnia[Number(args[0]) - 30 - 1].split(` `);
      else if (Number([args[0]]) > 40 && Number(args[0]) <= 50)
          args2 = radios.EU.Czech[Number(args[0]) - 40 - 1].split(` `);
      else if (Number([args[0]]) > 50 && Number(args[0]) <= 60)
          args2 = radios.EU.Denmark[Number(args[0]) - 50 - 1].split(` `);
      else if (Number([args[0]]) > 60 && Number(args[0]) <= 70)
          args2 = radios.EU.Germany[Number(args[0]) - 60 - 1].split(` `);
      else if (Number([args[0]]) > 70 && Number(args[0]) <= 80)
          args2 = radios.EU.Hungary[Number(args[0]) - 70 - 1].split(` `);
      else if (Number([args[0]]) > 80 && Number(args[0]) <= 90)
          args2 = radios.EU.Ireland[Number(args[0]) - 80 - 1].split(` `);
      else if (Number([args[0]]) > 90 && Number(args[0]) <= 100)
          args2 = radios.EU.Italy[Number(args[0]) - 90 - 1].split(` `);
      else if (Number([args[0]]) > 100 && Number(args[0]) <= 110)
          args2 = radios.EU.Luxembourg[Number(args[0]) - 100 - 1].split(` `);
      else if (Number([args[0]]) > 110 && Number(args[0]) <= 120)
          args2 = radios.EU.Romania[Number(args[0]) - 110 - 1].split(` `);
      else if (Number([args[0]]) > 120 && Number(args[0]) <= 130)
          args2 = radios.EU.Serbia[Number(args[0]) - 120 - 1].split(` `);
      else if (Number([args[0]]) > 130 && Number(args[0]) <= 140)
          args2 = radios.EU.Spain[Number(args[0]) - 130 - 1].split(` `);
      else if (Number([args[0]]) > 140 && Number(args[0]) <= 150)
          args2 = radios.EU.Sweden[Number(args[0]) - 140 - 1].split(` `);
      else if (Number([args[0]]) > 150 && Number(args[0]) <= 160)
          args2 = radios.EU.TURKEY[Number(args[0]) - 150 - 1].split(` `);
      else if (Number([args[0]]) > 160 && Number(args[0]) <= 170)
          args2 = radios.EU.Ukraine[Number(args[0]) - 150 - 1].split(` `);
      else if (Number([args[0]]) > 170 && Number(args[0]) <= (170 + 46))
          args2 = radios.OTHERS.request[Number(args[0]) - 160 - 1].split(` `);
      else
          return message.reply("This radio station was not found")


      const song = {
          title: args2[0].replace("-", " "),
          url: args2[1],
          thumbnail: client.user.displayAvatarURL(),
      };

      message.reply(
          new Discord.MessageEmbed()
          .setTitle(song.title)
          .setColor(config.colors.yes)
          .setURL(song.url)
          .setFooter(client.user.username, client.user.displayAvatarURL())
      )

      //If not in the same channel return error
      if (message.guild.me.connection && channel !== message.guild.me.voice.channel)
          return message.reply(`You must be in the same Voice Channel as me`);

      if (!volume) volume = 50

      //try to join the Channel
      let connection = await channel.join().catch(console.error);
      //mute yourself
      try {
          await connection.voice.setSelfDeaf(true);
      } catch {}
      try {
          await connection.voice.setDeaf(true);
      } catch {}

      try {
          const dispatcher = await connection.play(song.url);
          await dispatcher.setVolumeLogarithmic(volume / 100)
          dispatcher.on("end", end => {
              channel.leave();
          });
          dispatcher.on("error", end => {
              channel.leave();
          });
      } catch (error) {
          console.error(error);
          await channel.leave();
      }

  }


  function stations(client, prefix, message) {
      let amount = 0;

      let United_Kingdom = "";
      for (let i = 0; i < radios.EU.Germany.length; i++) {
          United_Kingdom += `**${i+1+10*amount}** [${radios.EU.United_Kingdom[i].split(" ")[0].replace("-"," ")}](${radios.EU.United_Kingdom[i].split(" ")[1]})\n`
      }
      amount++;

      let austria = "";
      for (let i = 0; i < radios.EU.Austria.length; i++) {
          austria += `**${i+1+10*amount}** [${radios.EU.Austria[i].split(" ")[0].replace("-"," ")}](${radios.EU.Austria[i].split(" ")[1]})\n`
      }

      amount++;
      let Belgium = "";
      for (let i = 0; i < radios.EU.Belgium.length; i++) {
          Belgium += `**${i+1+10*amount}** [${radios.EU.Belgium[i].split(" ")[0].replace("-"," ")}](${radios.EU.Belgium[i].split(" ")[1]})\n`
      }

      amount++;
      let Bosnia = "";
      for (let i = 0; i < radios.EU.Bosnia.length; i++) {
          Bosnia += `**${i+1+10*amount}** [${radios.EU.Bosnia[i].split(" ")[0].replace("-"," ")}](${radios.EU.Bosnia[i].split(" ")[1]})\n`
      }

      amount++;
      let Czech = "";
      for (let i = 0; i < radios.EU.Czech.length; i++) {
          Czech += `**${i+1+10*amount}** [${radios.EU.Czech[i].split(" ")[0].replace("-"," ")}](${radios.EU.Czech[i].split(" ")[1]})\n`
      }

      amount++;
      let Denmark = "";
      for (let i = 0; i < radios.EU.Denmark.length; i++) {
          Denmark += `**${i+1+10*amount}** [${radios.EU.Denmark[i].split(" ")[0].replace("-"," ")}](${radios.EU.Denmark[i].split(" ")[1]})\n`
      }

      amount++;
      let germany = "";
      for (let i = 0; i < radios.EU.Germany.length; i++) {
          germany += `**${i+1+10*amount}** [${radios.EU.Germany[i].split(" ")[0].replace("-"," ")}](${radios.EU.Germany[i].split(" ")[1]})\n`
      }

      amount++;
      let Hungary = "";
      for (let i = 0; i < radios.EU.Hungary.length; i++) {
          Hungary += `**${i+1+10*amount}** [${radios.EU.Hungary[i].split(" ")[0].replace("-"," ")}](${radios.EU.Hungary[i].split(" ")[1]})\n`
      }

      amount++;
      let Ireland = "";
      for (let i = 0; i < radios.EU.Ireland.length; i++) {
          Ireland += `**${i+1+10*amount}** [${radios.EU.Ireland[i].split(" ")[0].replace("-"," ")}](${radios.EU.Ireland[i].split(" ")[1]})\n`
      }

      amount++;
      let Italy = "";
      for (let i = 0; i < radios.EU.Italy.length; i++) {
          Italy += `**${i+1+10*amount}** [${radios.EU.Italy[i].split(" ")[0].replace("-"," ")}](${radios.EU.Italy[i].split(" ")[1]})\n`
      }

      amount++;
      let Luxembourg = "";
      for (let i = 0; i < radios.EU.Luxembourg.length; i++) {
          Luxembourg += `**${i+1+10*amount}** [${radios.EU.Luxembourg[i].split(" ")[0].replace("-"," ")}](${radios.EU.Luxembourg[i].split(" ")[1]})\n`
      }

      amount++;
      let Romania = "";
      for (let i = 0; i < radios.EU.Romania.length; i++) {
          Romania += `**${i+1+10*amount}** [${radios.EU.Romania[i].split(" ")[0].replace("-"," ")}](${radios.EU.Romania[i].split(" ")[1]})\n`
      }

      amount++;
      let Serbia = "";
      for (let i = 0; i < radios.EU.Serbia.length; i++) {
          Serbia += `**${i+1+10*amount}** [${radios.EU.Serbia[i].split(" ")[0].replace("-"," ")}](${radios.EU.Serbia[i].split(" ")[1]})\n`
      }

      amount++;
      let Spain = "";
      for (let i = 0; i < radios.EU.Spain.length; i++) {
          Spain += `**${i+1+10*amount}** [${radios.EU.Spain[i].split(" ")[0].replace("-"," ")}](${radios.EU.Spain[i].split(" ")[1]})\n`
      }

      amount++;
      let Sweden = "";
      for (let i = 0; i < radios.EU.Sweden.length; i++) {
          Sweden += `**${i+1+10*amount}** [${radios.EU.Sweden[i].split(" ")[0].replace("-"," ")}](${radios.EU.Sweden[i].split(" ")[1]})\n`
      }

      amount++;
      let TURKEY = "";
      for (let i = 0; i < radios.EU.TURKEY.length; i++) {
          TURKEY += `**${i+1+10*amount}** [${radios.EU.TURKEY[i].split(" ")[0].replace("-"," ")}](${radios.EU.TURKEY[i].split(" ")[1]})\n`
      }

      amount++;
      let Ukraine = "";
      for (let i = 0; i < radios.EU.Ukraine.length; i++) {
          Ukraine += `**${i+1+10*amount}** [${radios.EU.Ukraine[i].split(" ")[0].replace("-"," ")}](${radios.EU.Ukraine[i].split(" ")[1]})\n`
      }

      amount++;
      let requests = "";
      for (let i = 0; i < radios.OTHERS.request.length; i++) {
          requests += `**${i+1+10*amount}** [${radios.OTHERS.request[i].split(" ")[0].replace("-"," ")}](${radios.OTHERS.request[i].split(" ")[1]})\n`
      }
      const infoembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("130 Radio Stations", client.user.displayAvatarURL(), " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(`
        \`\`\`You will see these Radio Stations for each Country:\`\`\`
    
        __***EU***__
        **Page 2:** \`United Kingdom\`
        **Page 3:** \`Austria\`
        **Page 4:** \`Belgium\`
        **Page 5:** \`Bosnia & Herzegovina\`
        **Page 6:** \`Czech\`
        **Page 7:** \`Denmark\`
        **Page 8:** \`Germany\`
        **Page 9:** \`Hungary\`
        **Page 10:** \`Ireland\`
        **Page 11:** \`Italy\`
        **Page 12:** \`Luxembourg\`
        **Page 13:** \`Romania\`
        **Page 14:** \`Serbia\`
        **Page 15:** \`Spain\`
        **Page 16:** \`Sweden\`
        **Page 17:** \`Turkey\`
        **Page 18:** \`Ukraine\`
            \`MORE SOON\`
        
        __**AMERICA**__
            \`SOON\`
    
        __**CUSTOM REQUESTS**__
        **Page 19:** \`First 10 custom Requests\`
    
        If you wanna play a Radio Station, simply type in: **\`${prefix}play <Station Number in Front of The Name> [Volume]\`** but volume is a number between 1 and 150 and optional!
        for Example: **\`${prefix}play 12 50\`**  -- This will play Radio Station: ****with the Volume **50**!
        `)

      const United_Kingdomembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("United_Kingdom - Radio Stations", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-united-kingdom_1f1ec-1f1e7.png", " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(United_Kingdom)
      const austriaembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("Austria - Radio Stations", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-austria_1f1e6-1f1f9.png", " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(austria)
      const Belgiumembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("Belgium - Radio Stations", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-belgium_1f1e7-1f1ea.png", " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(Belgium)
      const Bosniaembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("Bosnia & Herzegovina - Radio Stations", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-bosnia-herzegovina_1f1e7-1f1e6.png", " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(Bosnia)
      const Czechembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("Czech - Radio Stations", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-czechia_1f1e8-1f1ff.png", " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(Czech)
      const Denmarkembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("Denmark - Radio Stations", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-denmark_1f1e9-1f1f0.png", " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(Denmark)
      const germanyembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("Germany - Radio Stations", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-germany_1f1e9-1f1ea.png", " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(germany)
      const Hungaryembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("Hungary - Radio Stations", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-hungary_1f1ed-1f1fa.png", " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(Hungary)
      const Irelandembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("Ireland - Radio Stations", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-ireland_1f1ee-1f1ea.png", " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(Ireland)
      const Italyembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("Italy - Radio Stations", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-italy_1f1ee-1f1f9.png", " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(Italy)
      const Luxembourgembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("Luxembourg - Radio Stations", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-luxembourg_1f1f1-1f1fa.png", " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(Luxembourg)
      const Romaniaembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("Romania - Radio Stations", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-romania_1f1f7-1f1f4.png", " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(Romania)
      const Serbiaembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("Serbia - Radio Stations", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-serbia_1f1f7-1f1f8.png", " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(Serbia)
      const Spainembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("Romania - Radio Stations", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-spain_1f1ea-1f1f8.png", " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(Spain)
      const Swedenembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("Sweden - Radio Stations", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-sweden_1f1f8-1f1ea.png", " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(Sweden)
      const TURKEYembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("Turkey - Radio Stations", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-turkey_1f1f9-1f1f7.png", " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(TURKEY)
      const Ukraineembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("Ukraine - Radio Stations", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/flag-ukraine_1f1fa-1f1e6.png", " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(Ukraine)

      const Reqeustembed = new Discord.MessageEmbed()
          .setColor("#7fafe3")
          .setAuthor("Reqeusted - Radio Stations", client.user.displayAvatarURL(), " https://milrato.eu")
          .setFooter(client.user.username, client.user.displayAvatarURL())
          .setDescription(requests)

      pages = [
          infoembed,
          United_Kingdomembed,
          austriaembed,
          Belgiumembed,
          Bosniaembed,
          Czechembed,
          Denmarkembed,
          germanyembed,
          Hungaryembed,
          Irelandembed,
          Italyembed,
          Luxembourgembed,
          Romaniaembed,
          Serbiaembed,
          Spainembed,
          Swedenembed,
          TURKEYembed,
          Ukraineembed,
          Reqeustembed
      ];
      return paginationEmbed(message, pages, ['⏪', '⏩'], 600000);
  }