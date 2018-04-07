//note model

//require mongoose
var mongoose = require("mongoose");

//create the schema class using mongoose's schema method
var Schema = mongoose.Schema;

//create the noteSchema 
var noteSchema = new Schema({
//headline is the article associated with the note
  _headlineId: {
    type: Schema.Types.ObjectId,
    ref: "Headline"
  },
// date
  date: {
    type: Date,
    default: Date.now
  },
  noteText: String
});

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;