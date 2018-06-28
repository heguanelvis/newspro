const cheerio = require('cheerio');
const mongoose = require('mongoose');
const request = require('request');
const path = require('path');

const db = require('../models');

const newsUrl = 'hhttp://www.nytimes.com/';

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

    // app.get('/scrape', (req, res) => {
    //     request(newsUrl, (error, scrapeResponse, html) => {
    //         const $ = cheerio.load(html);
    //         $("article h2").each((i, element) => {
    //             let news={};
    //             news.title = $(this).children("a").text();
    //             news.link = $(this).children("a").attr("href");
    //             console.log(news)
    //         })
    //     })
    // })

    app.get("/scrape", function (req, res) {
        request("https://www.nytimes.com/section/world", function (error, response, html) {
            var $ = cheerio.load(html);
            $("div.story-body").each(function (i, element) {
                var news = {};
                var link = $(element).find("a").attr("href");
                var title = $(element).find("h2.headline").text().trim();
                var summary = $(element).find("p.summary").text().trim();
                var img = $(element).parent().find("figure.media").find("img").attr("src");
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
            console.log("Scrape finished.");
        });
    });

}
