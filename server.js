require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8080;

const app = express();


app.use(express.static('public'));
app.use(logger('dev'));

app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//////////////////////////////////////////Routes///////////////////////////////////////////////
require("./routes/api-routes")(app);

///////////////////////////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
    console.log('App running on port ' + PORT + '!');
});
