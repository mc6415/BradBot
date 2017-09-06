const express = require('express');
const router = express.Router();
const siteConfig = require('../botconfig.js');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;
const Theories = require('../saltytheory');
const siteServices = require('../siteservice');

router.get('/list', function(req,res){

    const saltyTheories = [];
    let connection = new Connection(siteConfig.sqlConfig);

    connection.on('connect', (err) => {
        request = new Request("SELECT SaltyTheory FROM SaltyTheories", (err) => {
            if(err){console.log(err); }
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
                theories: saltyTheories,
                isLoggedIn: siteServices.isLoggedIn(req)
            });
        });

        connection.execSql(request);
    })
});

router.post('/add', function(req,res){
    let connection = new Connection(siteConfig.sqlConfig);

    connection.on('connect', (err) => {
        const newTheory = req.body.theory;
        Theories.addTheory(newTheory, connection, res, req);
    });
});

router.get('/war', (req,res)=>{
    console.log(req.session);
    if(siteServices.isLoggedIn(req)){
        res.render("potnoodle", {
            isLoggedIn: true,
            hasVoted: req.session.user.HasVoted
        });
    } else {
        res.redirect('/');
    }
});

router.get('/getWarNumbers', (req,res) => {
    let connection = new Connection(siteConfig.sqlConfig);
    let voteResults = {};

    connection.on('connect', (err) => {

        requestYay = new Request("SELECT * FROM PotNoodle WHERE Vote = 'yes'", (err) => {
            if(err){console.log(err);}
            connection.execSql(requestNay);
        });
        requestNay = new Request("SELECT * FROM PotNoodle WHERE Vote = 'no'", (err) => {
            if(err){console.log(err);}
            connection.close();
        });

        requestYay.on('doneInProc', (rowCount) => {
            voteResults.yay = rowCount;
        });

        requestNay.on('doneInProc', (rowCount) => {
            voteResults.nay = rowCount;
        });

        connection.execSql(requestYay);
    });

    connection.on('end', (err) => {
        res.send(voteResults);
    })

});

router.post('/vote', (req,res) => {
   let connection = new Connection(siteConfig.sqlConfig);

   connection.on('connect', (err) => {
       requestVote = new Request(`INSERT INTO PotNoodle (UserVoted, Vote) VALUES (@username, @vote)`, (err) => {
           if(err){console.log(err);}
           connection.execSql(requestUser);
       });
       requestUser = new Request('UPDATE [User] SET HasVoted = 1 WHERE UserName = @username', (err) => {
           if(err){console.log(err);}
           connection.close();
       });

       requestVote.addParameter('username', TYPES.NVarChar, req.session.user.UserName);
       requestVote.addParameter('vote', TYPES.NVarChar, req.body.vote);
       requestUser.addParameter('username', TYPES.NVarChar, req.session.user.UserName);

       requestUser.on('doneProc', () => {
           req.session.user.HasVoted = true;
       });

       connection.execSql(requestVote);

   });

   connection.on('end', (err) => {
       res.send("");
   })
});

module.exports = router;