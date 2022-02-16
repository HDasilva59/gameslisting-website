import express from "express";
import nunjucks from "nunjucks";
import request from "@fewlines-education/request";

const app = express();

app.set("view engine", "njk");

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.get("/", (req, res) => {
  res.render("homepage");
});

app.get("/platforms", (req, res) => {
  request("http://videogame-api.fly.dev/platforms", (error, body) => {
    if (error) {
      throw error;
    }
    const platforms = JSON.parse(body);
    res.render("platforms", { platforms });
  });
});

app.get("/platforms/:slug", (req, res) => {
  request(`http://videogame-api.fly.dev/platforms/${req.params.slug}`, (error, body) => {
    if (error) {
      throw error;
    }
    const platforms = JSON.parse(body);
    request(`http://videogame-api.fly.dev/games/platforms/${req.params.slug}`, (error, body) => {
      if (error) {
        throw error;
      }
      const game = JSON.parse(body);
      res.render("platformslug", { platforms, game });
    });
  });
});

app.get("/games", (req, res) => {
  request("http://videogame-api.fly.dev/games", (error, body) => {
    if (error) {
      throw error;
    }
    const games = JSON.parse(body);
    res.render("listofgames", { games });
  });
});

app.get("/games/:slug", (req, res) => {
  request(`http://videogame-api.fly.dev/games/${req.params.slug}`, (error, body) => {
    if (error) {
      throw error;
    }
    const game = JSON.parse(body);
    console.log(game);
    res.render("game", { game });
  });
});

//app.get("/action", (req, res) => {});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
