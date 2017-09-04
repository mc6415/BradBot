const express = require('express');
const router = express.Router();
const siteConfig = require('../botconfig.js');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;
const Theories = require('../saltytheory');

router.get('/list', function(req,res){

    const saltyTheories = [];

    let connection = new Connection(siteConfig.sqlConfig);

    connection.on('connect', (err) => {
        request = new Request("SELECT SaltyTheory FROM SaltyTheories", (err) => {
            if(err){
                console.log(err);
            }

            connection.close();
        });

        request.on('row', (columns) =>{
            for(const col of columns){
                saltyTheories.push(col.value);
            }
        });

        request.on('doneProc', (rowCount, more)=>{
            res.render('theories', {
                title: 'Salty Theories',
                theories: saltyTheories
            });
        });

        connection.execSql(request);
    })
});

router.post('/add', function(req,res){
    let connection = new Connection(siteConfig.sqlConfig);

    connection.on('connect', (err) => {
        const newTheory = req.body.theory;
        Theories.addTheory(newTheory, connection, res);
    });
});

module.exports = router;