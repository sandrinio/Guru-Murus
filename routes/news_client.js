var express = require('express');
var router = express.Router();
var News = require('../models/news');
var Apps = require('../models/applications');

router.get('/client/Hot-News/:id', function (req, res) {
  var appObject = {};
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


module.exports = router;