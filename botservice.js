exports.run = function(){
    const Discord = require('discord.js'),
         client = new Discord.Client(),
         ConfigFile = require('./botconfig'),
         botConfig = ConfigFile.config,
         Connection = require('tedious').Connection,
         connection = new Connection(ConfigFile.sqlConfig),
         Request = require('tedious').Request,
         TYPES = require('tedious').TYPES,
         SaltyTheory = require('./saltytheory');

    const getRandomNumber = (range) =>{
        return Math.floor(Math.random() * range);
    };

    client.on('ready', () => {
        console.log("Bot Online!");
    });

    client.on('message', (message) => {
        if(message.content.startsWith(botConfig.prefix + "theory")){
            SaltyTheory.theory(message);
        }
        if(message.content.startsWith(botConfig.prefix + "f")){
            message.delete();
            message.channel.send({file: botConfig.payRespects});
        }

        if(message.content.startsWith(botConfig.prefix + "accts")){
            message.delete();
            let accounts = ["Zylbad#1463", "NotZylbad#2805", "HangeZoe#21506", "Handsoap#11298", "Pineapple#21810", "Obscure#11322", "Obscure#21579"];
            let acctString = "";

            for(const acct of accounts){
                acctString += `${acct}\n\n`;
            }

            message.channel.send(acctString);
        }

        if(message.content.startsWith(botConfig.prefix + "theories")){
            const args = message.content.slice(botConfig.prefix.length).trim().split(/ +/g);
            const commands = args.shift().toLowerCase();

            switch(args[0]){
                case "all" :
                    SaltyTheory.allTheories(message);
                    break;
                case "latest" :
                    SaltyTheory.latestTheory(message);
                    break;
            }
        }

        if(message.content.startsWith(botConfig.prefix + "bitchboi")){
            const args = message.content.slice(botConfig.prefix.length).trim().split(/ +/g);
            const commands = args.shift().toLowerCase();
            message.delete();
            message.channel.send(`Where you at Bitch Boi ${args[0]}?`);
        }

        if(message.content.startsWith(botConfig.prefix + "emoji")){
            message.delete();
            const emojiList = message.guild.emojis.map(e => e.toString()).join(" ");
            console.log(emojiList);
        }
    });

    client.login(botConfig.discordToken);
};

