const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;
const Connection = require('tedious').Connection;
const siteConfig = require('./botconfig');
const Discord = require('discord.js');
const client = new Discord.Client();

exports.theory = function(message){
    const getRandomNumber = (range) => {
        return Math.floor(Math.random() * range);
    };

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
            message.channel.send(`Salty Theory #${getRandomNumber(101)}: ${theories[getRandomNumber(theories.length)]}`)
            message.delete();
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