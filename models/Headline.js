//headline model

//require mongoose
var mongoose = require("mongoose");

//create a schema class using mongoose's schema method
var Schema = mongoose.Schema;

//create the headlineSchema
var headlineSchema = new Schema({
//headline is required
  headline: {
    type: String,
    required: true,
    unique: { index: { unique: true } }
  },
//summary is required
  summary: {
    type: String,
    required: true
  },
// url is required
  url: {
    type: String,
    required: true
  },
// date
  date: {
    type: Date,
    default: Date.now
  },
  saved: {
    type: Boolean,
    default: false
  }
});

var Headline = mongoose.model("Headline", headlineSchema);

module.exports = Headline;
