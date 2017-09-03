const express = require('express');
const router = express.Router();
const siteConfig = require('../botconfig.js');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;

/**
 *  Connect to the SQL database.
 */
const connection = new Connection(siteConfig.sqlConfig);

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("Doing a thing");
  res.render('index', { title: 'Express' });
});

router.get('/SaltyTheories', function(req,res){

  const saltyTheories = [];

  request = new Request("SELECT SaltyTheory FROM SaltyTheories", (err) => {
      if(err){
        console.log("Problem connecting to database");
      }
  });

  request.on('row', (columns) =>{
    for(const col of columns){
      saltyTheories.push(col.value);
    }
  });

  request.on('doneProc', (rowCount, more)=>{
    console.log(saltyTheories);
    res.render('theories', {
      title: 'Salty Theories',
      theories: saltyTheories
    });
  });

  connection.execSql(request);
});

module.exports = router;
