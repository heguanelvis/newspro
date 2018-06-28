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
                let link = $(element).find("a").attr("href");
                let title = $(element).find("h2.headline").text().trim();
                let summary = $(element).find("p.summary").text().trim();
                let img = $(element).parent().find("figure.media").find("img").attr("src");
                news.link = link;
                news.title = title;
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
            });
            console.log("Scrape done successfully.");
        });
    });

}
