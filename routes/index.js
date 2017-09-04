const express = require('express');
const router = express.Router();
const siteConfig = require('../botconfig.js');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;
const Theories = require('../saltytheory');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
