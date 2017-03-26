var express = require('express');
var router = express.Router();
var path = require('path');
var middleware = require('../middleware');
var Apps = require('../models/applications'),
    fs             = require('fs'),
    formidable     = require('formidable'),
    readChunk      = require('read-chunk'),
    fileType       = require('file-type');


router.get('/admin/app-list', function (req, res) {
  Apps.find({}, function (err, app) {
    if(err){
      return console.log(err)
    }
    res.render('admin/applications/app_list', {app: app })
  });
});

router.get('/admin/app/new', function(req, res){
   res.render('admin/applications/new')
});

// SHOW
router.get('/admin/app/:id', function(req, res){
  // Apps.findById();
});

// EDIT
router.get('/admin/app/:id/edit', function (req, res) {
  Apps.findById(req.params.id, function (err, editApp) {
    if(err){
      res.send(err)
    }else{
      res.render('admin/applications/edit', { editApp: editApp })
    }
  });
});


// ADMIN SIDE
router.post('/admin/app/new', function (req, res) {
  var applicationData = req.body.app;
      applicationData.downloadLinks = req.body.downloadLinks;
      applicationData.author = {
                              fullname: req.user.fullname,
                              pic: "",
                              id: req.user._id
                               };
      Apps.create(applicationData, function (err, newApp) {
        if(err){
          res.send(err);
        }else{
          req.flash('success', 'New Application Posted')
          res.redirect('back');
        }
      });
});

router.post('/app/upload', function(req, res){
    var photos = [],
    form = new formidable.IncomingForm();

  // Tells formidable that there will be multiple files sent.
  form.multiples = true;
  // Upload directory for the images
  form.uploadDir = path.join(__dirname, '../public/uploads/apps/');

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
      fs.rename(file.path, path.join(__dirname, '../public/uploads/apps/' + filename));

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

  form.on('error', function(err) {
    console.log('Error occurred during processing - ' + err);
  });

  // Invoked when all the fields have been processed.
  form.on('end', function() {
    console.log('All the request fields have been processed.');
  });

  // Parse the incoming form fields.
  form.parse(req, function (err, fields, files) {
    res.status(200).json(photos);
  });
});


router.put('/admin/app/:id/edit', function (req, res) {
  var applicationData = req.body.app;
  applicationData.downloadLinks = req.body.downloadLinks;
  Apps.findByIdAndUpdate(req.params.id, applicationData, function (err, editedApp) {
    if( err ){
      res.send(err)
    }else{
      res.redirect('back')
    }
  })
});

router.delete('/admin/app/:id/delete', function (req, res) {
  Apps.findByIdAndRemove(req.params.id, function (err, delPost) {
    if( err ){
      res.send(error)
    }else{
      res.redirect('back');
    }
  })
});


module.exports = router;