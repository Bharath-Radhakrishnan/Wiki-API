//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Article = mongoose.model("Article", articleSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

////////////////////////////////////ROUTE ALL ARTICLES/////////////////////////////////////////////////////////////
app.route("/articles")
  .get(function(req, res) {
    Article.find({}, function(err, foundList) {
      if (!err) {
        res.send(foundList);
      } else res.send(err);
    });
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save();
    res.send("gotcha post")
  })
  .delete(function(req, res) {

    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Succesfully Deleted all articles");
      } else {
        res.send(err);
      }
    });
  });
///////////////////////////////////////////////////////////ROUTE A SPECIFIC ARTICLE////////////////////////////////////////
app.route("/articles/:articleName")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleName
    }, function(err, foundItem) {
      if (foundItem) {
        res.send(foundItem);
      } else {
        res.send("Item not found");
      }
    });
  })
  .put(function(req, res) {
    Article.update({
      title: req.params.articleName
    }, {
      title: req.body.title,
      content: req.body.content
    }, {
      overwrite: true
    }, function(err) {
      if (!err) console.log("Succesfully updated using put");
    });
  })
  .patch(function(req, res) {
    Article.updateOne({
        title: req.params.articleName
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) console.log("Succesfully updated using patch");
      }
    );
  })
  .delete(function(req, res) {
    Article.deleteOne({
      title: req.params.articleName
    }, function(err) {
      if (!err) console.log("Succesfully deleted " + req.params.articleName);
    });
  });




app.listen(3000, function() {
  console.log("Server started on port 3000");
})
