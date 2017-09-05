const Request = require('tedious').Request,
TYPES = require('tedious').TYPES;

exports.theory = function(message, connection){
  const Discord = require('discord.js'),
    client = new Discord.Client(),
    ConfigFile = require('./botconfig'),
    botConfig = ConfigFile.config;


    const getRandomNumber = (range) => {
        return Math.floor(Math.random() * range);
    };

    const theories = [];

    request = new Request("SELECT SaltyTheory FROM SaltyTheories", (err) => {
        if(err){ console.log(err); }
    });

    request.on('row', (columns) => {
        for(const col of columns){
            theories.push(col.value);
        }
    });

    request.on('doneProc', (rowCount) =>{
        message.channel.send(`Salty Theory #${getRandomNumber(101)}: ${theories[getRandomNumber(theories.length)]}`)
    });

    connection.execSql(request);
};

exports.addTheory = function(theory, connection, res, req){

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
};