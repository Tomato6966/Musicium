# Musicium

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Tomato6966/)
[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://GitHub.com/Tomato6966/Ask-Me-Anything)
[![Support Server](https://img.shields.io/discord/591914197219016707.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/fS6qBSm)

An advanced Music Bot, with 30+ Radio Stations, with capability of filters, like Bassboost, Nightcore, etc. and reaction interactivity. Based on ytdl-core with discord.js Guide Handler. With ideas from eritislami 

You can always [invite](https://bit.ly/Musicium) the Bot to your Server if you wish, its public and you can use it!

### **IMPORTANT!** 

If you decide to use this Bot, [check out this Github of me first](https://github.com/Tomato6966/Music-Bot-with-Filter) cause this is the same exact Bot with standard Discord/Unicode Emojis, which means that you can just simply use it instantly without changing the emojis!

This is an old version use [this repository.](https://github.com/Tomato6966/distube-music-bot)

#### Commands:

- `+filter <FILTERNAME>` --    *Set Audio - Effects*
- `+loop`                --    *Toggle music loop*
- `+lyrics`              --    *Get lyrics for the currently playing song*
- `+nowplaying`          --    *Show current song*
- `+pause`               --    *Pause the currently playing music*
- `+play <TITEL | URL>`  --    *Plays song from YouTube/Stream*
- `+queue`               --    *Show the music queue and now playing*
- `+radio <RADIOSTATION>`--    *Play a Radiostation*
- `+remove`              --    *Remove song from the queue*
- `+resume`              --    *Resume currently playing music*
- `+search <TITEL | URL>`--    *Search and select videos to play*
- `+shuffle`             --    *Shuffles the current Queue!*
- `+skip`                --    *Skip the currently playing song*
- `+skipto <QUEUE NUM.>` --    *Skip to the selected queue number*
- `+stop`                --    *Stops the music*
- `+volume <VOL. NUM.>`  --    *Change volume*
- `+botlist`             --    *Gives you the botlists of the Bot*
- `+help [COMMAND]`      --    *Gives you a list of all help Commands*
- `+invite`              --    *Gives you an invite*
- `+ping`                --    *Gives you the latency of the Bot*
- `+prefix`              --    *Sets a server specific Prefix*
- `+uptime`              --    *Gives you the uptime of the Bot*

**NO API-KEY NEEDED!** That's because it uses a scraper (`youtube-sr`)!

## Installation | How to use the Bot

 **1.** Install [node.js v12](https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode) or higher

 **2.** Install [ffmpeg@latest](https://ffmpeg.org) 

 **3.** Download this repo and unzip it    |    or git clone it
 
 **4.** Install all of the packages with **`npm install`**     |  the packages are   **`npm install node.js @discordjs/opus discord.js ffmpeg-static figlet lyrics-finder string-progressbar ytdl-core discord-ytdl-core youtube-sr quick.db`**
 
 **5.** start the bot with **`node index.js`**

## Usage - config.json

```json
{
  "TOKEN": "",
  "PREFIX": "+",
  "approveemoji": "EMOJIID",
  "denyemoji": "EMOJIID",
  "erroremoji": "EMOJIID"
}
```

It is important that you fill in every item of the JSON FILE! every emoji used in this BOT is a custom emoji, the emojis are listed down below as images, which you can download and upload to your server to use them. NOTE: you gotta change emoji.id to emoji.name if you use discord / unicode emojis! Soon a new Repo with standard emojis will be awailable for easy usages!

## **Video:**

[![](http://img.youtube.com/vi/AgmaTBGnfYw/0.jpg)](http://www.youtube.com/watch?v=AgmaTBGnfYw "")


## **NOTE:**

*Make sure that you have installed [FFmpeg](https://ffmpeg.org), and added it to Systemenvironment variables (PATH)*

*If you are having errors/problems with starting delete the package.json file and do, before you install the packages `npm init`*

## SUPPORT ME

You can always Support me by inviting one of my **own Discord Bots**

[![Musicium Music Bot](https://cdn.discordapp.com/attachments/742446682381221938/770055673965707264/test1.png)](dc.musicium.eu)
[![Milrato Muslti Bot](https://cdn.discordapp.com/attachments/742446682381221938/770056826724679680/test1.png)](https://bit.ly/Milrato)

[| fork my repository  |](https://github.com/user/repository/fork)
[watch this repo  |](https://github.com/user/repository/subscription)
[create issue |](https://github.com/user/repository/issues/new)

*Both bots are still in Development, and will always be in development, this means always uptodate and always online and always improving!*

[![](https://cdn.discordapp.com/emojis/770098066552258611.png)](https://cdn.discordapp.com/emojis/770098066552258611.png) 

## Credits

[@eritislami](https://github.com/eritislami/) For the Reacting system to messages, great Idea i adopted that [@iCrawl/evobot](https://github.com/eritislami/evobot)

## emojis

[![](https://cdn.discordapp.com/emojis/770290491731476500.png)](https://cdn.discordapp.com/emojis/770290491731476500.png) 
[![](https://cdn.discordapp.com/emojis/769675858431705109.png)](https://cdn.discordapp.com/emojis/769675858431705109.png) 
[![](https://cdn.discordapp.com/emojis/769933892014440448.png)](https://cdn.discordapp.com/emojis/769933892014440448.png) 
[![](https://cdn.discordapp.com/emojis/769932569235292170.png)](https://cdn.discordapp.com/emojis/769932569235292170.png) 
[![](https://cdn.discordapp.com/emojis/769932441946816542.png)](https://cdn.discordapp.com/emojis/769932441946816542.png) 
[![](https://cdn.discordapp.com/emojis/769932441909067786.png)](https://cdn.discordapp.com/emojis/769932441909067786.png) 
[![](https://cdn.discordapp.com/emojis/769932441967263754.png)](https://cdn.discordapp.com/emojis/769932441967263754.png) 
[![](https://cdn.discordapp.com/emojis/769915194444480542.png)](https://cdn.discordapp.com/emojis/769915194444480542.png) 
[![](https://cdn.discordapp.com/emojis/769912238236106793.png)](https://cdn.discordapp.com/emojis/769912238236106793.png) 
[![](https://cdn.discordapp.com/emojis/769913064194834511.png)](https://cdn.discordapp.com/emojis/769913064194834511.png) 
[![](https://cdn.discordapp.com/emojis/769915194066862080.png)](https://cdn.discordapp.com/emojis/769915194066862080.png) 
[![](https://cdn.discordapp.com/emojis/770266575839952936.png)](https://cdn.discordapp.com/emojis/770266575839952936.png) 
[![](https://cdn.discordapp.com/emojis/769945882120028160.png)](https://cdn.discordapp.com/emojis/769945882120028160.png) 
[![](https://cdn.discordapp.com/emojis/769935094285860894.gif)](https://cdn.discordapp.com/emojis/769935094285860894.gif) 
[![](https://cdn.discordapp.com/emojis/769665713124016128.png)](https://cdn.discordapp.com/emojis/769665713124016128.png) 
[![](https://cdn.discordapp.com/emojis/769940554481532938.png)](https://cdn.discordapp.com/emojis/769940554481532938.png) 
[![](https://cdn.discordapp.com/emojis/770326304473350145.png)](https://cdn.discordapp.com/emojis/770326304473350145.png) 
[![](https://cdn.discordapp.com/emojis/769661787053752400.png)](https://cdn.discordapp.com/emojis/769661787053752400.png) 
[![](https://cdn.discordapp.com/emojis/769938447279456296.png)](https://cdn.discordapp.com/emojis/769938447279456296.png) 
[![](https://cdn.discordapp.com/emojis/770098066552258611.png)](https://cdn.discordapp.com/emojis/770098066552258611.png) 
