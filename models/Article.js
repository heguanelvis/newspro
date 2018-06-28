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
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

let Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;