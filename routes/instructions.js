var express = require('express');
var router = express.Router();
var multer  = require('multer');
var path = require('path');
var middleware = require('../middleware');
var News = require('../models/news'),
  fs             = require('fs'),
  formidable     = require('formidable'),
  readChunk      = require('read-chunk'),
  fileType       = require('file-type');

router.get('/admin/instructions', function (req, res) {
  res.send("instructions page")
});

router.get('/admin/instructions/:id', function (req, res) {
  res.send('instructions show by id')
});

router.get('/admin/instructions/new', function (req, res) {
  res.send('instructions new')
});

router.post('/admin/instructions', function (req, res) {

});

module.exports = router;