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
    });

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
        });

        setTimeout(() => {
            res.send(allNews)
        }, 1500);
    });

    app.get("/api/saved/:id", (req, res) => {
        let saveId = req.params.id;
        console.log(saveId);
        let savedArticle = allNews.find(e => e.tempId == saveId);

        db.Article.create(savedArticle)
            .then(dbArticle => { console.log(dbArticle) })
            .catch(err => {
                return res.json(err);
            });
    });

    app.get("/allsaved", (req, res) => {
        db.Article.find({})
            .populate("notes")
            .then(dbArticles => {
                console.log(dbArticles)
                res.render("allsaved", {
                    dbArticles: dbArticles
                })
            })
    });

    app.get("/api/delete/:id", (req, res) => {
        let deleteId = req.params.id;
        console.log(deleteId);
        db.Article.findByIdAndRemove(deleteId, (err, res) => {
            if (err) throw err;
            console.log("Article deleted successfully!");
        });
    });

    app.post("/api/notes/:articleId", (req, res) => {
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Article.findOneAndUpdate({ _id: req.params.articleId }, { notes: dbNote._id }, { new: true });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

}
