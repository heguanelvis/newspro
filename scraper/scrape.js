const request = require("request");
const cheerio = require("cheerio");
const uuidv4 = require("uuid/v4");

const scrape = newsUrl => {
  return new Promise((resolve, reject) => {
    request(newsUrl, (error, scrapeResponse, html) => {
      const $ = cheerio.load(html);
      let store = [];

      $("div.css-4jyr1y").each((i, element) => {
        if (i >= 10) return;

        const url = `https://www.nytimes.com${$(element)
          .find("a")
          .attr("href")}`;
        const headline = $(element)
          .find("a")
          .find("h2")
          .text()
          .trim();
        const summary = $(element)
          .find("a")
          .find("p.e1xfvim31")
          .text()
          .trim();
        const img = $(element)
          .find("div.css-79elbk")
          .find("img")
          .attr("src")
          .replace(
            "thumbWide.jpg?quality=75&auto=webp&disable=upscale",
            "threeByTwoMediumAt2X.jpg"
          );

        const news = { url, headline, summary, img, tempId: uuidv4() };
        store.push(news);
      });

      resolve(store);
    });
  });
};

module.exports = scrape;
