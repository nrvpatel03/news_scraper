var cheerio = require("cheerio");
var request = require("request");

request("https://cryptonews.com/news/", function(error,response, html){
    var $ = cheerio.load(html);

    var results = [];

    $("div.props").each(function(i, element){

        var ele = $(element).children('h4').children().text();
        results.push(ele);
    });
    console.log(results);
})