require("dotenv").config();
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var logger = require("morgan");
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');

var PORT = process.env.PORT || 8080;

var app = express();


app.use(express.static("public"));
app.use(logger("dev"));

app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
    extended: true
}));

// Local Mongo Database
var db = 'mongodb://localhost/CrazyNewsifier';

mongoose.connect(db, function (err) {

    if (err) {
        console.log(err);
    } else {
        console.log('mongoose connection is sucessful');
    }

});

//////////////////////////////////////////Routes///////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
