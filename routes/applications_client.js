var express = require('express');
var router = express.Router();
var Apps = require('../models/applications');


var appObject = {};
router.get('/app/show/:id', function (req, res) {
  Apps.find({})
    .sort('-date')
    .limit(5)
    .exec(function (err, apps) {
      if (err) {
        res.send(err)
      } else {
        appObject.apps = apps;
      }
      Apps.findById(req.params.id, function (err, result) {
        if (err) {
          console.log(err);
        } else {

          res.render('client/apps_show', {
            app: result,
            apps: appObject
          });

        }
      });
    });
});

module.exports = router;