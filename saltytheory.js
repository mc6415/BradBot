const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;
const Connection = require('tedious').Connection;
const siteConfig = require('./botconfig');
const Discord = require('discord.js');
const client = new Discord.Client();

const getRandomNumber = (range) => {
    return Math.floor(Math.random() * range);
};

exports.theory = function(message){
    const theories = [];

    let connection = new Connection(siteConfig.sqlConfig);

    connection.on('connect', (err) => {
        request = new Request("SELECT SaltyTheory FROM SaltyTheories", (err) => {
            if(err){ console.log(err); }
            connection.close();
        });

        request.on('row', (columns) => {
            for(const col of columns){
                theories.push(col.value);
            }
        });

        request.on('doneProc', (rowCount) =>{
            message.delete();
            message.channel.send(`Salty Theory #${getRandomNumber(101)}: ${theories[getRandomNumber(theories.length)]}`, {tts:true})
                .then(msg => {
                    const emojiList = message.guild.emojis.map(e => e.toString()).join(" ");
                    msg.react("345948468063240203");
                })
        });

        connection.execSql(request);
    });
};

exports.latestTheory = (message) => {
    let connection = new Connection(siteConfig.sqlConfig);
    const theories = [];

    connection.on('connect', (err) => {
       request = new Request("SELECT TOP 1 SaltyTheory FROM SaltyTheories ORDER BY Id DESC", (err) => {
           if(err){ console.log(err); }
           connection.close();
       });

       request.on('row', (columns) => {
           for(const col of columns){
               theories.push(col.value);
           }
       });

       request.on('doneProc', (rowCount) => {
           message.delete();
           message.channel.send(`Salty Theory #${getRandomNumber(101)}: ${theories[0]}`, {tts:true})
               .then(msg => {
                   msg.react("345948468063240203");
               });
       });

       connection.execSql(request);
    });
};

exports.allTheories = (message) => {
    let connection = new Connection(siteConfig.sqlConfig);
    let theories = [];
    let theory = "";

    connection.on('connect', (err) =>{
       request = new Request("SELECT SaltyTheory FROM SaltyTheories", (err) => {
           if(err){ console.log(err); }
           connection.close();
       });

       request.on('row', (cols) => {
           for(const col of cols){
               const newTheory = `Salty Theory #${getRandomNumber(101)}: ${col.value}\n`;
               if(theory.length + newTheory.length > 2000){
                   theories.push(theory);
                   theory = `SaltyTheory #${getRandomNumber(101)}: ${col.value}\n`;
               } else {
                   theory += newTheory;
               }
               // theories.push(`Salty Theory #${getRandomNumber(101)}: ${col.value}\n\n`);
           }
       });

       request.on('doneProc', (rowCount) => {
           message.delete();
           theories.push(theory);
           for(const x of theories){
               message.channel.send(x);
           }
       });

       connection.execSql(request);
    });
};

exports.addTheory = function(theory, res, req){

    let connection = new Connection(siteConfig.sqlConfig);

    connection.on('connect', (err) => {
        request = new Request("INSERT INTO SaltyTheories (SaltyTheory, AddedBy) VALUES (@Theory, @AddedBy)", (err) => {
            if(err){console.log(err);}
            connection.close();
        });

        request.addParameter('Theory', TYPES.NVarChar, theory);
        request.addParameter('AddedBy', TYPES.NVarChar, req.session.user.UserName);

        request.on('row', (columns) => {
            for(const col of columns){
                if(col.value === null) {console.log('NULL');}
                else {
                    console.log(`Product id of inserted item is ${col.value}`);
                }
            }
        });

        request.on('doneProc', () =>{
            res.redirect('/theories/list');
        });

        connection.execSql(request);
    });
};