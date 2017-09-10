const express = require('express');
const router = express.Router();
const Connection = require('tedious').Connection;
const siteConfig = require('../botconfig');
const Request =  require('tedious').Request;
const TYPES = require('tedious').TYPES;
const sha256 = require('sha256');
const randomString = require('crypto-random-string');

router.get('/login', function(req,res){
    res.render('login');
});

router.get('/signup', function(req,res){
    res.render('signup');
});

router.post('/add', function(req,res){
  let salt = randomString(10);
  let pepper = randomString(10);
  let password = `${sha256.x2(salt)}${sha256.x2(req.body.password)}${sha256.x2(pepper)}`;
  let message = "";
  let messageType = "";
  let userExists = false;

  let connection = new Connection(siteConfig.sqlConfig);

  connection.on('connect', (err) => {

      checkRequest = new Request("SELECT * FROM [User] WHERE email = @email", (err) => {
          if(err){console.log(err);}
          if(userExists = true){
              connection.close();
          } else {
              connection.execSql(addRequest);
          }
      });

      checkRequest.addParameter('email', TYPES.NVarChar, req.body.email);

      addRequest = new Request("INSERT INTO [User] (UserName, Salt, Pepper, Password, IsAdmin, email) VALUES (@username, @salt, @pepper, @password, 0, @email)", (err) => {
          if(err){console.log(err);}
          connection.close();
      });

      addRequest.addParameter('username', TYPES.NVarChar, req.body.username);
      addRequest.addParameter('salt', TYPES.NVarChar, salt);
      addRequest.addParameter('pepper', TYPES.NVarChar, pepper);
      addRequest.addParameter('password', TYPES.NVarChar, password);
      addRequest.addParameter('email', TYPES.NVarChar, req.body.email);

      checkRequest.on('doneInProc', (rowCount) => {
         if(rowCount > 0){
             message = "Email already exists in database!";
             messageType = "error";
             userExists = true;
         }
      });

      addRequest.on('row', (columns) => {
          console.log(columns);
          for(const col of columns){
              if(col.value === null) {console.log('NULL');}
              else {
                  console.log(`Product id of inserted item is ${col.value}`);
              }
          }
      });

      addRequest.on('doneProc', () => {
          message = "Thanks for signing up!";
          messageType = "success";
      });

      connection.execSql(checkRequest);
  });

  connection.on('end', () => {
      res.render('login', {message: message, messageType: messageType});
  });

});

router.post('/signin', (req,res) => {
    let username = req.body.username;
    let connection = new Connection(siteConfig.sqlConfig);

    connection.on('connect', (err) => {
        request = new Request(`SELECT * FROM [User] WHERE UserName = @username`, (err) => {
            if(err){console.log(err);}
            connection.close();
        });

        request.addParameter('username', TYPES.NVarChar, username);

        request.on('doneInProc', (rowCount, more, rows) => {
            if(rowCount){
                let userData = rows[0];
                let userEntry = {};
                for(const col of userData){
                    userEntry[col.metadata.colName] = col.value;
                }

                let dbPassword = userEntry.Password;
                let enteredPassword = `${sha256.x2(userEntry.Salt)}${sha256.x2(req.body.password)}${sha256.x2(userEntry.Pepper)}`;

                if(dbPassword === enteredPassword){
                    console.log(userEntry);
                    req.session.user = {UserName: userEntry.UserName, IsAdmin: userEntry.IsAdmin, HasVoted: userEntry.HasVoted};
                    console.log(req.session);
                    res.redirect("/");
                } else {
                    res.render('login', {message: "Password didn't match the one stored, are you sure it was correct?", messageType: "error"})
                }
            } else {
                res.render('login', {message: "Problem Logging in, are you sure you have an account?", messageType: "error"})
            }
        });

        connection.execSql(request);
    });
});

router.get('/logout', (req,res) => {
    req.session.destroy((err) => {
        res.redirect("/");
    });
});

module.exports = router;
