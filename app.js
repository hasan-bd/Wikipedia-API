const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true});

//TODO
const articleSchema ={
  title: String,
  content: String
}
 const Article = mongoose.model("Article", articleSchema)

///////////  Request Targetting Articles ///////

app.route('/articles')
  .get(function(req,res){
    Article.find(function(err,foundArticles){
      if(!err){
        res.send(foundArticles)
      }else{
        res.send(err)
      }

    })
  })
  .post(function(req,res){
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })
    newArticle.save(function(err){
      if(!err){
        res.send("Successfully added new article into collecions")
      }else{
        res.send(err)
      }
    })
  })
  .delete(function(req,res){
    Article.deleteMany(function(err){
      if(!err){
        res.send("Successfully deleted all Articles.")
      }else{
        res.send(err)
      }
    })
  })

  ///////////  Request Targetting A Specific Articles ///////


  app.route('/articles/:articleTitle')
    .get(function(req,res){
      Article.findOne({title: req.params.articleTitle},function(err,resultFoundArticle){
        if(resultFoundArticle){
          res.send(resultFoundArticle);
        }else{
          res.send("No Articles matching that title was found");
      }
    })
  })

  .put(function(req,res){
    Article.update(
      {title: req.params.articleTitle},
      { title: req.body.title,content:req.body.content},
      {overwrite:true},
      function(err){
        if(!err){
          res.send("Successfully update the artile.")
        }
      }
    )
  })


  .patch(function(req,res){
    Article.update(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Successfully Patch/ Specific Items updated")
        }else{
          res.send(err)
        }
      }
    )
  })


  .delete(function(req,res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if(!err){
          res.send("Successfully Deleted Coresponding Articles.")
        }else{
          res.send(err)
        }
      }
    )
  })

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
