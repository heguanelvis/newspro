const cheerio = require('cheerio');
const mongoose = require('mongoose');
const request = require('request');
const path = require('path');

const db = require('../models');

const newsUrl = 'https://www.cnn.com/';

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

    app.get('/scrape', (req, res) => {
        request(newsUrl, (error, scrapeResult, html) => {
            const $ = cheerio.load(html);
        })
    })

}
