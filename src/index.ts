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
    if (typeof req.query.page === "string") {
      const current = parseInt(req.query.page);
      if (current > Math.ceil(platforms.total / 20)) {
        request(`http://videogame-api.fly.dev/platforms?page=${Math.ceil(platforms.total / 20)}`, (error, body) => {
          if (error) {
            throw error;
          }
          const platforms = JSON.parse(body);
          const current = Math.ceil(platforms.total / 20);
          res.render("platforms", { platforms, current });
        });
      } else if (current < 1) {
        request(`http://videogame-api.fly.dev/platforms`, (error, body) => {
          if (error) {
            throw error;
          }
          const platforms = JSON.parse(body);
          const current = 1;
          res.render("platforms", { platforms, current });
        });
      } else {
        request(`http://videogame-api.fly.dev/platforms?page=${current}`, (error, body) => {
          if (error) {
            throw error;
          }
          const platforms = JSON.parse(body);
          res.render("platforms", { platforms, current });
        });
      }
    } else {
      request("http://videogame-api.fly.dev/platforms", (error, body) => {
        if (error) {
          throw error;
        }
        const platforms = JSON.parse(body);
        const current = 1;
        res.render("platforms", { platforms, current });
      });
    }
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
    if (typeof req.query.page === "string") {
      const current = parseInt(req.query.page);
      if (current > Math.ceil(games.total / 20)) {
        request(`http://videogame-api.fly.dev/games?page=${Math.ceil(games.total / 20)}`, (error, body) => {
          if (error) {
            throw error;
          }
          const games = JSON.parse(body);
          const current = Math.ceil(games.total / 20);
          res.render("listofgames", { games, current });
        });
      } else if (current < 1) {
        request(`http://videogame-api.fly.dev/games`, (error, body) => {
          if (error) {
            throw error;
          }
          const games = JSON.parse(body);
          const current = 1;
          res.render("listofgames", { games, current });
        });
      } else {
        request(`http://videogame-api.fly.dev/games?page=${current}`, (error, body) => {
          if (error) {
            throw error;
          }
          const games = JSON.parse(body);
          res.render("listofgames", { games, current });
        });
      }
    } else {
      request("http://videogame-api.fly.dev/games", (error, body) => {
        if (error) {
          throw error;
        }
        const games = JSON.parse(body);
        const current = 1;
        res.render("listofgames", { games, current });
      });
    }
  });
});

app.get("/games/:slug", (req, res) => {
  request(`http://videogame-api.fly.dev/games/${req.params.slug}`, (error, body) => {
    if (error) {
      throw error;
    }
    const game = JSON.parse(body);
    res.render("game", { game });
  });
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
