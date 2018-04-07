/* code to render page of saved articles */

$(document).ready(function() {
    //a reference to the article container div we will be rendering all articles inside of
      var articleContainer = $(".article-container");
    //event listeners for dynamically creating buttons for deleting articles,
    //pulling up article notes, saving article notes and deleting article notes
      $(document).on("click", ".btn.delete", handleArticleDelete);
      $(document).on("click", ".btn.notes", handleArticleNotes);
      $(document).on("click", ".btn.save", handleNoteSave);
      $(document).on("click", ".btn.note-delete", handleNoteDelete);
    
      initPage();
    
      function initPage() {
    //empties the article container, run an AJAX request for any saved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function(data) {
    //if we have headlines, render them to the page
          if (data && data.length) {
            renderArticles(data);
          }
          else {
    //otherwise render a message explaing we have no articles
            renderEmpty();
          }
        });
      }
    
      function renderArticles(articles) {
    //handles appending HTML containing our article data to the page
        var articlePanels = [];
    //we pass each article JSON object to the createPanel function which returns a bootstrap
    //panel with our article data inside
        for (var i = 0; i < articles.length; i++) {
          articlePanels.push(createPanel(articles[i]));
        }
    //append all the HTML to the articlePanels container
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
            "<a class='btn btn-danger delete'>",
            "Delete From Saved",
            "</a>",
            "<a class='btn btn-warning notes'>Write a Note</a>",
            "</h3>",
            "</div>",
            "<div class='panel-body'>",
            article.summary,
            "</div>",
            "</div>"
          ].join("")
        );
    //attach the article's id, key for removing or adding a note
        panel.data("_id", article._id);
        return panel;
      }
    
      function renderEmpty() {
    //renders HTML to the page explaining no articles to view
        var emptyAlert = $(
          [
            "<div class='alert alert-warning text-center'>",
            "<h4>Uh Oh. Looks like we don't have any saved articles.</h4>",
            "</div>",
            "<div class='panel panel-default'>",
            "<div class='panel-heading text-center'>",
            "<h3>Would You Like to Browse Available Articles?</h3>",
            "</div>",
            "<div class='panel-body text-center'>",
            "<h4><a href='/'>Browse Articles</a></h4>",
            "</div>",
            "</div>"
          ].join("")
        );
        articleContainer.append(emptyAlert);
      }
    
      function renderNotesList(data) {
    //handles rendering note list items to our notes modal
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
    //if no notes, display a message explaing this
          currentNote = ["<li class='list-group-item'>", "No notes for this article yet.", "</li>"].join("");
          notesToRender.push(currentNote);
        }
        else {
    //if we do have notes, go through each one
          for (var i = 0; i < data.notes.length; i++) {
    //constructs an li element to contain our noteText and a delete button
            currentNote = $(
              [
                "<li class='list-group-item note'>",
                data.notes[i].noteText,
                "<button class='btn btn-danger note-delete'>x</button>",
                "</li>"
              ].join("")
            );
    //store the note id on the delete button for easy access when trying to delete
            currentNote.children("button").data("_id", data.notes[i]._id);
            notesToRender.push(currentNote);
          }
        }
    //append the notesToRender to the note-container inside the note modal
        $(".note-container").append(notesToRender);
      }
    
      function handleArticleDelete() {
    //handles deleting articles/headlines by id
        var articleToDelete = $(this).parents(".panel").data();
      //uses a delete method 
        $.ajax({
          method: "DELETE",
          url: "/api/headlines/" + articleToDelete._id
        }).then(function(data) {
    //if this works out, run initPage again which will rerender our list of saved articles
          if (data.ok) {
            initPage();
          }
        });
      }
    
      function handleArticleNotes() {
    //handles opending the notes modal and displaying our notes
        var currentArticle = $(this).parents(".panel").data();
    //grab any notes with this headline/article id
        $.get("/api/notes/" + currentArticle._id).then(function(data) {
    //constructing HTML to add to the notes modal
          var modalText = [
            "<div class='container-fluid text-center'>",
            "<h4>Notes For Article: ",
            currentArticle._id,
            "</h4>",
            "<hr />",
            "<ul class='list-group note-container'>",
            "</ul>",
            "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
            "<button class='btn btn-success save'>Save Note</button>",
            "</div>"
          ].join("");
    //adds formatted HTML to the note modal
          bootbox.dialog({
            message: modalText,
            closeButton: true
          });
          var noteData = {
            _id: currentArticle._id,
            notes: data || []
          };
          $(".btn.save").data("article", noteData);
    //renderNotesList will populate the HTML inside of the modal we just created/opened
          renderNotesList(noteData);
        });
      }
    
      function handleNoteSave() {
    //handles what happens when a user tries to save a new note for an article: sets var and saves type
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();
    //if we have data typed into the note input field, format it and post it
        if (newNote) {
          noteData = {
            _id: $(this).data("article")._id,
            noteText: newNote
          };
          $.post("/api/notes", noteData).then(function() {
            bootbox.hideAll();
          });
        }
      }
    
      function handleNoteDelete() {
    //handles the deletion of notes by id
        var noteToDelete = $(this).data("_id");
        $.ajax({
          url: "/api/notes/" + noteToDelete,
          method: "DELETE"
        }).then(function() {
          bootbox.hideAll();
        });
      }
    });
    