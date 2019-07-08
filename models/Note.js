const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let NoteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

let Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
