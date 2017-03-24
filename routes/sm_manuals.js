var express = require('express');
var router = express.Router();


router.get('/manuals/smartphone-manuals', function (req, res) {
  res.render('client/sm_manuals')
});



module.exports = router;