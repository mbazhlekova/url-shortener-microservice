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

      var newLink = (db, callback) => {
        if (validUrl.isUri(params)) {
          var shortAddr = shortid.generate();
          var newUrl = {
            url: params,
            short: shortAddr
          };
          collection.insert([newUrl]);
          res.json(newUrl);
        } else {
          res.json({
            error: "Wrong URL format, please enter a valid URL."
          })

        };
      };
      newLink(db, () => {
        db.close();
      });
    };
  });
});

router.get('/:short', (req, res, next) => {

  MongoClient.connect(mongoUrl, (err, db) => {
    if (err) {
      console.log("Unable to connect to server", err);
    }
    else {
      console.log("Connected to server");
      var collection = db.collection('links');
      var params = req.params.short;

      var findLink = (db, cb) => {
        collection.findOne({"short": params}, {url: 1, _id: 0}, (err, doc) => {
          if (doc != null) {
            res.redirect(doc.url);
          }
          else {
            res.json({error: "Not found in database"})
          }
        });

      };
      findLink(db, () => {
        db.close();
      });
    };

  });

});

module.exports = router;