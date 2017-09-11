const express = require('express');
const router = express.Router();
const siteConfig = require('../botconfig.js');
const Request = require('tedious').Request;
const TYPES = require('tedious').TYPES;
const Theories = require('../saltytheory');
const siteService = require('../siteservice');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.render('index', { title: 'Express', isLoggedIn: siteService.isLoggedIn(req), user: req.session.user });
});

module.exports = router;
