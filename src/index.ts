import express from "express";
import nunjucks from "nunjucks";
import request from "@fewlines-education/request";

const app = express();
app.set("view engine", "njk");

app.use(express.static("public"));

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.get("/", (req, res) => {
  res.render("homepage");
});

app.get("/platforms", (req, res) => {
  if (typeof req.query.page === "string") {
    const current = parseInt(req.query.page);
    if (current < 1 || isNaN(current)) {
      request(`http://videogame-api.fly.dev/platforms`, (error, body) => {
        if (error) {
          throw error;
        }
        const platforms = JSON.parse(body);
        const current = 1;
        const totalpages = Math.ceil(platforms.total / 20);
        res.render("platforms", { platforms, current, totalpages });
      });
    } else {
      request(`http://videogame-api.fly.dev/platforms?page=${current}`, (error, body) => {
        if (error) {
          throw error;
        }
        const platforms = JSON.parse(body);
        const totalpages = Math.ceil(platforms.total / 20);
        const isAtTheEnd = lastPage(current, totalpages);
        res.render("platforms", { platforms, current, totalpages, isAtTheEnd });
      });
    }
  } else {
    request(`http://videogame-api.fly.dev/platforms`, (error, body) => {
      if (error) {
        throw error;
      }
      const platforms = JSON.parse(body);
      const current = 1;
      const totalpages = Math.ceil(platforms.total / 20);
      const isAtTheEnd = lastPage(current, totalpages);
      res.render("platforms", { platforms, current, totalpages, isAtTheEnd });
    });
  }
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
  if (typeof req.query.page === "string") {
    const current = parseInt(req.query.page);
    if (current < 1 || isNaN(current)) {
      request(`http://videogame-api.fly.dev/games`, (error, body) => {
        if (error) {
          throw error;
        }
        const games = JSON.parse(body);
        const current = 1;
        const totalpages = Math.ceil(games.total / 20);
        const isAtTheEnd = lastPage(current, totalpages);
        res.render("listofgames", { games, current, totalpages, isAtTheEnd });
      });
    } else {
      request(`http://videogame-api.fly.dev/games?page=${current}`, (error, body) => {
        if (error) {
          throw error;
        }
        const games = JSON.parse(body);
        const totalpages = Math.ceil(games.total / 20);
        const isAtTheEnd = lastPage(current, totalpages);
        res.render("listofgames", { games, current, totalpages, isAtTheEnd });
      });
    }
  } else {
    request(`http://videogame-api.fly.dev/games`, (error, body) => {
      if (error) {
        throw error;
      }
      const games = JSON.parse(body);
      const current = 1;
      const totalpages = Math.ceil(games.total / 20);
      const isAtTheEnd = lastPage(current, totalpages);
      console.log(games);
      res.render("listofgames", { games, current, totalpages, isAtTheEnd });
    });
  }
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

function lastPage(current: number, totalpages: number): boolean {
  if (current === totalpages) {
    return true;
  } else {
    return false;
  }
}

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
