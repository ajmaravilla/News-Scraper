// Controller for our scraper
var db = require("../models");
var scrape = require("../scripts/scrape");

module.exports = {
  scrapeHeadlines: function(req, res) {
//scrape the NYT website
    return scrape()
      .then(function(articles) {
//then insert articles into the db
        return db.Headline.create(articles);
      })
      .then(function(dbHeadline) {
//if no new headlines
        if (dbHeadline.length === 0) {
          res.json({
            message: "No new articles today. Check back tomorrow!"
          });
        }
        else {
//else send back a count of how many new articles we scraped
          res.json({
            message: "Added " + dbHeadline.length + " new articles!"
          });
        }
      })
      .catch(function(err) {
        res.json({
          message: "Scrape complete!!"
        });
      });
  }
};
