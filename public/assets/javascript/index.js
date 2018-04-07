/* code to render page */

$(document).ready(function() {
    //a reference to the article-container div where all the dynamic content will go
      var articleContainer = $(".article-container");
    //event listeners to any dynamically generated "save article" and "scrape new article" buttons
      $(document).on("click", ".btn.save", handleArticleSave);
      $(document).on("click", ".scrape-new", handleArticleScrape);
    
      initPage();
    
      function initPage() {
    //empptied the article container, run an AJAX request for any unsaved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=false").then(function(data) {
    //if new headlines, render them to the page
          if (data && data.length) {
            renderArticles(data);
          }
          else {
    //otherwise render a message explaing no articles
            renderEmpty();
          }
        });
      }
    
      function renderArticles(articles) {
    //handles appending HTML containing our article data to the page
        var articlePanels = [];
    //pass each article JSON object to the createPanel function
        for (var i = 0; i < articles.length; i++) {
          articlePanels.push(createPanel(articles[i]));
        }
    //append HTML to the articlePanels container
        articleContainer.append(articlePanels);
      }
    
      function createPanel(article) {
    //takes in a single JSON object for an article/headline and constructs a jQuery element    
        var panel = $(
          [
            "<div class='panel panel-default'>",
            "<div class='panel-heading'>",
            "<h3>",
            "<a class='article-link' target='_blank' href='" + article.url + "'>",
            article.headline,
            "</a>",
            "<a class='btn btn-primary save'>",
            "Save This Article",
            "</a>",
            "</h3>",
            "</div>",
            "<div class='panel-body'>",
            article.summary,
            "</div>",
            "</div>"
          ].join("")
        );
    //attach the article's id to the jQuery element
        panel.data("_id", article._id);
        return panel;
      }
    
      function renderEmpty() {
    //renders HTML to the page explaining we don't have any articles to view
        var emptyAlert = $(
          [
            "<div class='alert alert-warning text-center'>",
            "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
            "</div>",
            "<div class='panel panel-default'>",
            "<div class='panel-heading text-center'>",
            "<h3>What Would You Like To Do?</h3>",
            "</div>",
            "<div class='panel-body text-center'>",
            "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
            "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
            "</div>",
            "</div>"
          ].join("")
        );
    //appending data to the page
        articleContainer.append(emptyAlert);
      }
    
      function handleArticleSave() {
    //when the user wants to save an article
        var articleToSave = $(this)
          .parents(".panel")
          .data();
        articleToSave.saved = true;
        $.ajax({
          method: "PUT",
          url: "/api/headlines/" + articleToSave._id,
          data: articleToSave
        }).then(function(data) {
          if (data.saved) {
            initPage();
          }
        });
      }
    
      function handleArticleScrape() {
    //handles the user clicking "scrape new article" button and reners to page
        $.get("/api/fetch").then(function(data) {
          initPage();
          bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
        });
      }
    });
    