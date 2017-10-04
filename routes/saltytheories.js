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
        request = new Request("SELECT Id, SaltyTheory, AddedBy, Hidden FROM SaltyTheories", (err) => {
            if(err){console.log(err); }
            connection.close();
        });

        request.on('row', (columns) =>{
            let theory = {};
            for(const col of columns){
                theory[col.metadata.colName] = col.value
            }

            saltyTheories.push(theory);
        });

        request.on('doneInProc', (rowCount, more, rows)=>{
            res.render('theories', {
                title: 'Salty Theories',
                theories: saltyTheories,
                isLoggedIn: siteServices.isLoggedIn(req),
                user: req.session.user
            });
        });

        connection.execSql(request);
    })
});

router.post('/add', function(req,res){

        const newTheory = req.body.theory;
        Theories.addTheory(newTheory, res, req);

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

router.get('/edit/:id', (req,res) => {
    let connection = new Connection(siteConfig.sqlConfig);
    let theory = {};
    const theoryId = req.params.id;

    connection.on('connect', (err) => {
        request = new Request(`SELECT SaltyTheory, AddedBy, Id FROM SaltyTheories WHERE Id = @id`, (err) => {
            if(err){console.log(err);}
            connection.close();
        });

        request.addParameter('id', TYPES.Int, theoryId);

        request.on('doneInProc', (rowCount, more, rows) => {
            if(rowCount === 1){
                theory = rows[0][0].value;
                addedBy = rows[0][1].value;
                id = rows[0][2].value;

                if(addedBy === req.session.user.UserName || req.session.user.IsAdmin){
                    res.render('theoryedit', {theory: theory, canSee: true, theoryId: id});
                } else {
                    res.render('theoryedit', {canSee: false});
                }
            } else {console.log("Problem getting Theory");}

        });

        connection.execSql(request);
    });
});

router.get('/delete/:id', (req,res) => {
    const theoryId = req.params.id;

   let connection = new Connection(siteConfig.sqlConfig);

   connection.on('connect', (err) => {
       request = new Request("DELETE FROM SaltyTheories WHERE Id = @id", (err) => {
            if(err) {console.log(err);}
            connection.close();
        });

       request.addParameter('id', TYPES.Int, theoryId);

       request.on('doneProc', () => {
           res.redirect('/theories/list');
       });

       connection.execSql(request);
   });
});

router.post('/update/:id', (req,res) => {
    const newTheory = req.body.saltyTheory;
    const theoryId = req.params.id;

    let connection = new Connection(siteConfig.sqlConfig);

    connection.on('connect', (err) => {
        request = new Request("UPDATE SaltyTheories SET SaltyTheory = @theory WHERE Id = @id", (err) => {
           if(err){console.log(err);}
           connection.close();
        });

        request.addParameter('theory', TYPES.NVarChar, newTheory);
        request.addParameter('id', TYPES.Int, theoryId);

        request.on('doneInProc', () => {
            res.redirect('/theories/list');
        });

        connection.execSql(request);

    })
});

module.exports = router;