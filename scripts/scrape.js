//scrape script
//require axios and cheerio to scrape
var axios = require("axios");
var cheerio = require("cheerio");

var scrape = function() {
//scrape the NYTimes website
  return axios.get("http://www.nytimes.com").then(function(res) {
    var $ = cheerio.load(res.data);
//an empty array to save our scraped articles
    var articles = [];

//loop through each element that has the "theme-summary" class
    $(".theme-summary").each(function(i, element) {
//grab the child with the class story-heading (article headline)
      var head = $(this)
        .children(".story-heading")
        .text()
        .trim();

//grab the URL of the article
      var url = $(this)
        .children(".story-heading")
        .children("a")
        .attr("href");

//grab any children with the class of summary and then grab it's inner text (article summary)
      var sum = $(this)
        .children(".summary")
        .text()
        .trim();

//as long as our headline, summary and url aren't empty or undefined, do the following
      if (head && sum && url) {
//tiding our headlines and summaries
        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

//initialize an object we will push to the articles array
        var dataToAdd = {
          headline: headNeat,
          summary: sumNeat,
          url: url
        };

        articles.push(dataToAdd);
      }
    });
    return articles;
  });
};

module.exports = scrape;
