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





var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/blogUploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({ storage: storage });




router.get('/admin/news/new', middleware.isLoggedIn, function (req, res) {
  res.render('admin/news/new');
});


router.get('/admin/hotNews/:id', function (req, res) {
  News.findById(req.params.id, function (err, post) {
    if(err){
      console.log(err)
    }else{
      res.render('admin/news/show', {post: post})
    }
  });
});

router.get('/admin/news/:id/edit', function (req, res) {
  res.render('admin/news/edit')
});

router.post('/upload_photos', function (req, res){
  var photos = [],
    form = new formidable.IncomingForm();

  // Tells formidable that there will be multiple files sent.
  form.multiples = true;
  // Upload directory for the images
  form.uploadDir = path.join(__dirname, '../public/uploads/blogUploads/');

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
    if (type !== null && (type.ext === 'png' || type.ext === 'jpg' || type.ext === 'jpeg')) {
      // Assign new file name
      filename = Date.now() + '-' + file.name;

      // Move the file with the new file name
      fs.rename(file.path, path.join(__dirname, '../public/uploads/blogUploads/' + filename));

      // Add to the list of photos
      photos.push({
        status: true,
        filename: filename,
        type: type.ext,
        publicPath: '/uploads/blogUploads/' + filename
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



router.post('/news/new/blogPost', middleware.isLoggedIn, function(req, res){
  var postContent = req.body.blogPost;
  postContent.author = {
                    fullname: req.user.fullname,
                    pic: "",
                    id: req.user._id
                       };
  News.create(postContent, function (err, createdPost) {
    if(err){
        return console.log(err)
       }
       console.log(createdPost);
       res.redirect("/admin/admin-panel");
  });
});



router.delete('/news/:id', function (req, res) {
  News.findByIdAndRemove(req.params.id, function (err, blogPost) {
    if(err){
      console.log(err)
    }else{
      req.flash("success", blogPost.title + " " + "has been removed")
      res.redirect("/admin/admin-panel");
    }
  });
});



module.exports = router;