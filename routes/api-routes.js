const cheerio = require('cheerio');
const mongoose = require('mongoose');
const request = require('request');
const path = require('path');

const db = require('../models');

const newsUrl = 'https://www.nytimes.com/section/world';

// Local Mongo Database
mongoose.connect('mongodb://localhost/CrazyNewsifier', (error) => {

    if (error) {
        console.log(error);
    } else {
        console.log('mongoose connection is sucessful');
    }

});


// variables to use:
let allNews = [];

module.exports = (app) => {

    app.get("/", (req, res) => {
        res.render("index")
    });

    app.get("/scraped", (req, res) => {
        setTimeout(() => {
            res.render("scraped", { allNews: allNews })
        }, 2000);
    })

    app.get("/api-scrape", (req, res) => {
        allNews = [];

        request(newsUrl, (error, scrapeResponse, html) => {
            const $ = cheerio.load(html);
            $("div.story-body").each((i, element) => {
                if (i >= 10) {
                    return;
                };
                let news = {};
                let url = $(element).find("a").attr("href");
                let headline = $(element).find("h2.headline").text().trim();
                let summary = $(element).find("p.summary").text().trim();
                let img = $(element).parent().find("figure.media").find("img").attr("src");
                news.url = url;
                news.headline = headline;
                news.tempId = i;
                if (summary) {
                    news.summary = summary;
                };
                if (img) {
                    news.img = img;
                }
                else {
                    news.img = $(element).find(".wide-thumb").find("img").attr("src");
                };
                allNews.push(news)
            });
            console.log("Scrape done successfully.");
        })

        setTimeout(() => {
            res.send(allNews)
        }, 1500);
    });

    
    app.get("/api/saved/:id", (req, res) => {
        let saveId = req.params.id;
        console.log(saveId)
        let savedArticle = allNews.find(e => e.tempId==saveId);

        db.Article.create(savedArticle)
        .then(dbArticle => {console.log(dbArticle)})
        .catch(err => {
            return res.json(err);
        });
    })

    app.get("/allsaved", (req, res) => {
        db.Article.find({})
            .then(dbArticles => {
                res.render("allsaved", { dbArticles: dbArticles })
            })
    })

    // app.get("/articles", function (req, res) {
    //     db.Article.find({})
    //         .then(function (dbArticle) {
    //             res.render("index", dbArticle);
    //         })
    //         .catch(function (err) {
    //             res.render("index", err);
    //         });
    // });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("note")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.post("/articles/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

}
