const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let NoteSchema = new Schema({
    // `title` is of type String
    title: {
        type: String,
        required: true
    },
    // `body` is of type String
    body: {
        type: String,
        required: true
    }
});

let Note = mongoose.model("Note", NoteSchema);

module.exports = Note;