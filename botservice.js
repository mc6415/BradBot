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
            message.channel.send("Zylbad#1463");
            message.channel.send("NotZylbad#2805");
            message.channel.send("HangeZoe#21506");
            message.channel.send("Handsoap#11298");
            message.channel.send("Pineapple#21810");
            message.channel.send("Obscure#11322");
            message.channel.send("Obscure#21579");
        }
    });

    client.login(botConfig.discordToken);
};

