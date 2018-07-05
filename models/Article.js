const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    summary:{
        type: String,
    },
    url: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;