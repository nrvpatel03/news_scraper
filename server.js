var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var cheerio = require("cheerio");
var request = require("request");

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
//get route for getting all articles from database
//post/update route for articles Notes
//Think of some more?