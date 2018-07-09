var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var cheerio = require("cheerio");
var request = require("request");
//models
var db = require("./models");

var app = express();

var PORT = 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//for now just keep everything here, if later, we can put in separate
//folders. Right now just get it to work properly.
//think of a database name.
mongoose.connect("mongodb://localhost/newsScraper");

//Routes

//Get route for scraping
app.get("/scrape", function(req, res){
    request("https://cryptonews.com/news/", function(error, response, html){
        var $ = cheerio.load(html);
        
        $("div.props").each(function(i, element){
            var result = {};

            result.title = $(this).children('h4').children().text();
            result.link = $(this).children('h4').children().attr("href");

            db.Article.create(result)
            .then(function(dbArticle){
                console.log(dbArticle);
            })
            .catch(function(err){
                return res.json(err);
            });
        });
        
        res.send("Scrape Complete");
    });
});

//get route for getting all articles from database
app.get("/articles", function(req, res){
    db.Article.find({})
    .then(function(dbArticle){
        //change this later, gets them in an array!
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

//get a specific article and add note
app.get("/articles/:id", function(req, res){
    //remember what taylor said about req.params.id? validation?
    db.Article.findOne({_id: req.params.id})
    //associated note
    .populate("note")
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

//post/update route for articles Notes
app.post("/articles/:id", function(req, res){
    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
    })
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});


//delete route for articles Notes
app.delete("/articles/:id", function(req,res){
    //this deletes the whole article, just want to delete the note.
    db.Note.remove()
    .then(function(dbNote){
        return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id})
    })
    .then(function(dbArticle){
        res.json(dbArticle);
        console.log("deleted Note");
    })
    .catch(function(err){
        res.json(err);
    });
});

app.listen(PORT, function(){
    console.log("App running on port " + PORT);
});