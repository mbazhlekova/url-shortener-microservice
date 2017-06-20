var express = require('express');

var mongodb = require('mongodb');
var mongoUrl = 'mongodb://localhost:27017/url-shortener-microservice';
var MongoClient = mongodb.MongoClient;

var shortid = require('shortid');
var validUrl = require('valid-url');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/new/:url(*)', (req, res, next) => {
  MongoClient.connect(mongoUrl, (err, db) => {
    if (err) {
      console.log('Unable to connect to server', err);
    } else {
      console.log('Connected to server');
      var collection = db.collection('links');
      var params = req.params.url;
      var newLink = (db, callback) => {};
      newLink(db, () => {
        db.close();
      });
      var insertLink = {
        url: params,
        short: 'test'
      };
      collection.insert([insertLink]);
      res.send(params);

    }
  });
});

module.exports = router;