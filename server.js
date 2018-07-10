var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var cheerio = require("cheerio");
var request = require("request");
//models
var db = require("./models");

var app = express();

var PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

var MONGODB_URI =  process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

//Routes

//Get route for scraping
app.get("/scrape", function(req, res){
    //avoid dupicates.
    request("https://cryptonews.com/news/", function(error, response, html){
        var $ = cheerio.load(html);
        
        $("div.props").each(function(i, element){
            var result = {};

            result.title = $(this).children('h4').children().text();
            result.link = "https://cryptonews.com" + $(this).children('h4').children().attr("href");
            
            db.Article.update({title: result.title}, {$set: {title: result.title, link: result.link}}, {upsert: true})
            .then(function(dbArticle){
                console.log(dbArticle);
            })
            .catch(function(err){
                
                res.send(err);
            });
        });
        res.render("scraped");
    });
});



//get a specific article and add note
app.get("/articles/:id", function(req, res){
    db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle){
        var hbsObj = {
            article: dbArticle
        }
        res.render("notemaker",hbsObj);
        
    })
    .catch(function(err){
        res.json(err);
    });
    
});
//get a specific note

//post/update route for articles Notes
app.post("/articles/:id", function(req, res){
    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {upsert: true});
    })
    .then(function(dbArticle){
        console.log(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });

});


//delete route for articles Notes
app.delete("/articles/:id", function(req,res){
    
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





//get route for getting all articles from database, will be default.
app.get("*", function(req, res){
    db.Article.find({})
    .then(function(dbArticle){
        var hbsObj = {
            articles: dbArticle
        };
        res.render("index", hbsObj);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.listen(PORT, function(){
    console.log("App running on port " + PORT);
});