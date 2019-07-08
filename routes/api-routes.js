const mongoose = require("mongoose");
const scrape = require("../scraper/scrape");

const db = require("../models");
const newsUrl = "https://www.nytimes.com/section/world";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newspro";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, error => {
  if (error) {
    console.log(error);
  } else {
    console.log("mongoose connection is sucessful");
  }
});

let allNews = [];

const loaded = (req, res, next) => {
  if (allNews.length > 0) next();
  else loaded();
};

module.exports = app => {
  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/api-scrape", async (req, res) => {
    allNews = [];
    allNews = await scrape(newsUrl);
    res.send(allNews);
  });

  app.get("/scraped", loaded, (req, res) => {
    res.render("scraped", { allNews });
  });

  app.get("/api/saved/:id", (req, res) => {
    let saveId = req.params.id;
    console.log(saveId);
    let savedArticle = allNews.find(e => e.tempId == saveId);

    db.Article.create(savedArticle)
      .then(dbArticle => {
        console.log(dbArticle);
      })
      .catch(err => {
        return res.json(err);
      });
  });

  app.get("/allsaved", (req, res) => {
    db.Article.find({})
      .populate("notes")
      .then(dbArticles => {
        console.log(dbArticles);
        res.render("allsaved", {
          dbArticles: dbArticles
        });
      });
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
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate(
          { _id: req.params.articleId },
          { notes: dbNote._id },
          { new: true }
        );
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
};
