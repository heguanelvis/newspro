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


module.exports = (app) => {

    app.get('/', (req, res) => {
        res.send("Finally It works!")
    })

    app.get("/scrape", (req, res) => {
        request(newsUrl, (error, scrapeResponse, html) => {
            const $ = cheerio.load(html);
            $("div.story-body").each( (i, element) => {
                let news = {};
                let url = $(element).find("a").attr("href");
                let headline = $(element).find("h2.headline").text().trim();
                let summary = $(element).find("p.summary").text().trim();
                let img = $(element).parent().find("figure.media").find("img").attr("src");
                news.url = url;
                news.headline = headline;
                if (summary) {
                    news.summary = summary;
                };
                if (img) {
                    news.img = img;
                }
                else {
                    news.img = $(element).find(".wide-thumb").find("img").attr("src");
                };
                console.log(news)

                db.Article.create(news)
                    .then( (dbArticle) =>{
                        console.log(dbArticle);
                    })
                    .catch( (err) => {
                        return res.json(err);
                    });
            });
            console.log("Scrape done successfully.");
        });
        
    });

    app.get("/articles", function (req, res) {
        db.Article.find({})
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });



}
