var express = require('express');
var router = express.Router();
var multer  = require('multer');
var path = require('path');
var middleware = require('../middleware');
var Manual = require('../models/instruction'),
  fs             = require('fs'),
  formidable     = require('formidable'),
  readChunk      = require('read-chunk'),
  fileType       = require('file-type');


router.get('/admin/instructions', middleware.isLoggedIn, function (req, res) {
  Manual.find({}).sort('-date').exec(function (err, manu) {
    if(err){
      res.send(err);
    }else{
    res.render('admin/instructions/instructions', { manuals: manu })
    }
  });
});

router.get('/admin/instructions/new', middleware.isLoggedIn, function (req, res) {
  res.render('admin/instructions/new')
});

router.get('/admin/instructions/:id/edit', middleware.isLoggedIn, function (req, res) {
  Manual.findById(req.params.id, function (err, abc) {
    if(err){
      res.send(err)
    }else{
      res.render('admin/instructions/edit', { manu: abc });
    }
  });
});

router.post('/admin/instructions', middleware.isLoggedIn, function (req, res) {
  var instrContent = req.body.manual;
  instrContent.author = {
    fullname: req.user.fullname,
    pic: "",
    id: req.user._id
  };
  Manual.create(instrContent, function (err, createdManual) {
    if(err){
      res.send(err)
    }else{
      res.redirect('/admin/instructions')
    }
  })
});

router.post('/manuals_upload', function (req, res) {
  var photos = [],
    form = new formidable.IncomingForm();

  // Tells formidable that there will be multiple files sent.
  form.multiples = true;
  // Upload directory for the images
  form.uploadDir = path.join(__dirname, '../public/uploads/instructions/');

  // Invoked when a file has finished uploading.
  form.on('file', function (name, file) {
    // Allow only 3 files to be uploaded.
    if (photos.length === 3) {
      fs.unlink(file.path);
      return true;
    }

    var buffer = null,
      type = null,
      filename = '';

    // Read a chunk of the file.
    buffer = readChunk.sync(file.path, 0, 262);
    // Get the file type using the buffer read using read-chunk
    type = fileType(buffer);

    // Check the file type, must be either png,jpg or jpeg
    if (type !== null) {
      // Assign new file name
      filename = Date.now() + '-' + file.name;

      // Move the file with the new file name
      fs.rename(file.path, path.join(__dirname, '../public/uploads/instructions/' + filename));

      // Add to the list of photos
      photos.push({
        status: true,
        filename: filename,
        //type: type.ext,
        publicPath: '/uploads/apps/' + filename
      });
    } else {
      photos.push({
        status: false,
        filename: file.name,
        message: 'Invalid file type'
      });
      fs.unlink(file.path);
    }
  });

  form.on('error', function (err) {
    console.log('Error occurred during processing - ' + err);
  });

  // Invoked when all the fields have been processed.
  form.on('end', function () {
    console.log('All the request fields have been processed.');
  });

  // Parse the incoming form fields.
  form.parse(req, function (err, fields, files) {
    res.status(200).json(photos);
  });
});

router.put('/admin/instructions/:id', middleware.isLoggedIn, function (req, res) {
  Manual.findByIdAndUpdate(req.params.id, req.body.manual, function (err, manual) {
    if(err){
      res.send("err")
    }else{
      res.redirect('/admin/instructions')
    }
  });
});

router.delete('/admin/instructions/:id', middleware.isLoggedIn, function (req, res) {
  Manual.findByIdAndRemove(req.params.id, function (err, instruction) {
    if(err){
      console.log(err)
    }else{
      res.redirect("/admin/admin-panel");
    }
  });
});

module.exports = router;