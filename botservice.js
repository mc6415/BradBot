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
            SaltyTheory.theory(message, connection);
        }
    });

    client.login(botConfig.discordToken);
};

