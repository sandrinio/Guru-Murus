var express = require('express');
var router = express.Router();
var News = require("../models/news");
var Apps = require('../models/applications');
var middleware = require('../middleware');



// CLIENT SIDE
router.get('/', function (req, res) {
  var appObject = {};
  Apps.find({})
    .sort('-date')
    .limit(5)
    .exec(function (err, apps) {
    if( err ){
      res.send( err )
    }else{
      appObject.appz = apps;
    }
  });
  News.find({}).sort('-date').exec(function (err, newsPosts){
    if(err){
      console.log(err)
    }else{
      //hot news data
      var totalBlogPostsCount = newsPosts.length,
          pageSize = 6,
          pageCount = totalBlogPostsCount / pageSize + 1,
          currentPage = 1,
          blogPostsArray = [],
          blogPostsList = {};

      while (newsPosts.length > 0) {
        blogPostsArray.push(newsPosts.splice(0, pageSize));
    }
      if (typeof req.query.page !== 'undefined') {
        currentPage = + req.query.page;
      }
      blogPostsList.hot = blogPostsArray[ + currentPage - 1];
      res.render('client/clientLanding', {
                              data: blogPostsList,
                              apps: appObject,
                              pageSize: pageSize,
                              totalBlogPostsCount: totalBlogPostsCount,
                              pageCount: pageCount,
                              currentPage: currentPage
                             });
        }
    });
});

// ADMIN SIDE
router.get('/admin/admin-panel', middleware.isLoggedIn, function (req, res) {
  News.find({}).sort('-date').exec(function (err, newsPosts){
    if(err){
      console.log(err)
    }else{
      //hot news data
      var totalBlogPostsCount = newsPosts.length,
        pageSize = 10,
        pageCount = totalBlogPostsCount / pageSize + 1,
        currentPage = 1,
        blogPostsArray = [],
        blogPostsList = {};

      while (newsPosts.length > 0) {
        blogPostsArray.push(newsPosts.splice(0, pageSize));
      }
      if (typeof req.query.page !== 'undefined') {
        currentPage = + req.query.page;
      }
      blogPostsList.hot = blogPostsArray[ + currentPage - 1];
      res.render('admin/adminLanding', {
        data: blogPostsList,
        pageSize: pageSize,
        totalBlogPostsCount: totalBlogPostsCount,
        pageCount: pageCount,
        currentPage: currentPage
      });
    }
  });
});

module.exports = router;
