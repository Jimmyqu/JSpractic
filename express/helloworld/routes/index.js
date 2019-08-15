var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/catalog'); //重定向到首页
  // res.render('index', { title: 'first express web site' });
});

module.exports = router;
