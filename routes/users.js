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

  let connection = new Connection(siteConfig.sqlConfig);

  connection.on('connect', (err) => {
      request = new Request("INSERT INTO [User] (UserName, Salt, Pepper, Password, IsAdmin, email) VALUES (@username, @salt, @pepper, @password, 0, @email)", (err) => {
          if(err){console.log(err);}
          connection.close();
      });

      request.addParameter('username', TYPES.NVarChar, req.body.username);
      request.addParameter('salt', TYPES.NVarChar, salt);
      request.addParameter('pepper', TYPES.NVarChar, pepper);
      request.addParameter('password', TYPES.NVarChar, password);
      request.addParameter('email', TYPES.NVarChar, req.body.email);


      request.on('row', (columns) => {
          console.log(columns);
          for(const col of columns){
              if(col.value === null) {console.log('NULL');}
              else {
                  console.log(`Product id of inserted item is ${col.value}`);
              }
          }
      });

      request.on('doneProc', () => {
          res.render('login', {message: "Thanks for signing up!"})
      });

      connection.execSql(request);
  })

});

module.exports = router;
