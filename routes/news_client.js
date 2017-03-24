var express = require('express');
var router = express.Router();
var News = require('../models/news');

router.get('/client/Hot-News/:id', function (req, res) {
  News.findById(req.params.id, function (err, post) {
    if(err){
      console.log(err)
    }else{
      res.render('client/news_show', {blogPost: post})
    }
  });
});


module.exports = router;