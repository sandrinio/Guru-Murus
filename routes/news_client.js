var express = require('express');
var router = express.Router();
var News = require('../models/news');
var Apps = require('../models/applications');


var appObject = {};

router.get('/Hot-News/:id', function (req, res) {
  Apps.find({})
    .sort('-date')
    .limit(5)
    .exec(function (err, apps) {
      if( err ){
        res.send( err )
      }else{
        appObject.apps = apps;
      }
    });

  News.findById(req.params.id, function (err, post) {
    if(err){
      console.log(err)
    }else{
      res.render('client/news_show', {
                                      blogPost: post,
                                      apps: appObject
                                      })
    }
  });
});

router.get('/searchNews', function (req, res) {
  News.find({'title': req.query.q}, function (err, foundNews) {
    if(err){
      console.log(err)
    }else{
      console.log(req.query.q);
      res.send(foundNews)
    }
  })
});


module.exports = router;