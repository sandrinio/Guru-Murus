var express = require('express');
var router = express.Router();
var Apps = require('../models/applications');


router.get('/app/show/:id', function (req, res) {
  Apps.findById(req.params.id, function (err, result) {
    if(err){
      console.log(err);
    }else{
      res.render('client/apps_show', { app: result })
    }
  });
});

module.exports = router;