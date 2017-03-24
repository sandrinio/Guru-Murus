var express = require('express');
var router = express.Router();
var Apps = require('../models/applications')


router.get('/manuals/smartphone-manuals', function (req, res) {
  Apps.find({}).sort('-date').limit(5).exec(function (err, apps) {
      if( err ){
        res.send( err )
      }else{
        res.render('client/sm_manuals', { appz: apps })
      }
    });

});



module.exports = router;