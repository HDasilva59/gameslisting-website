import express from "express";
import nunjucks from "nunjucks";
import fetch from "node-fetch";

const app = express();
app.set("view engine", "njk");

app.use(express.static("public"));

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.get("/", (req, res) => {
  return res.render("homepage");
});

app.get("/platforms", (req, res) => {
  if (typeof req.query.page === "string") {
    const current = parseInt(req.query.page);
    if (current < 1 || isNaN(current)) {
      return fetch(`http://videogame-api.fly.dev/platforms`)
        .then((response) => response.json())
        .then((result) => {
          const platforms = result;
          const totalpages = Math.ceil(result.total / 20);
          const current = 1;
          return res.render("platforms", { platforms, totalpages, current });
        });
    } else {
      return fetch(`http://videogame-api.fly.dev/platforms`)
        .then((response) => response.json())
        .then((result) => {
          if (typeof req.query.page === "string") {
            const platforms = result;
            const totalpages = Math.ceil(result.total / 20);
            const current = parseInt(req.query.page);
            const isAtTheEnd = lastPage(current, totalpages);
            return res.render("platforms", {
              platforms,
              current,
              totalpages,
              isAtTheEnd,
            });
          }
        });
    }
  } else {
    return fetch(`http://videogame-api.fly.dev/platforms`)
      .then((response) => response.json())
      .then((result) => {
        const platforms = result;
        const totalpages = Math.ceil(result.total / 20);
        const current = 1;
        const isAtTheEnd = lastPage(current, totalpages);
        return res.render("platforms", { platforms, current, totalpages, isAtTheEnd });
      });
  }
});

app.get("/platforms/:slug", (req, res) => {
  return fetch(`http://videogame-api.fly.dev/platforms/${req.params.slug}`)
    .then((result) => result.json())
    .then((platforms) =>
      fetch(`http://videogame-api.fly.dev/games/platforms/${req.params.slug}`)
        .then((result) => result.json())
        .then((game) => res.render("platformslug", { platforms, game })),
    );
});

app.get("/games", (req, res) => {
  if (typeof req.query.page === "string") {
    const current = parseInt(req.query.page);
    console.log("test");
    if (current < 1 || isNaN(current)) {
      return fetch(`http://videogame-api.fly.dev/games`)
        .then((response) => response.json())
        .then((result) => {
          const games = result;
          const totalpages = Math.ceil(result.total / 20);
          const current = 1;
          return res.render("listofgames", { games, totalpages, current });
        });
    } else {
      return fetch(`http://videogame-api.fly.dev/games`)
        .then((response) => response.json())
        .then((result) => {
          if (typeof req.query.page === "string") {
            const games = result;
            const totalpages = Math.ceil(result.total / 20);
            const current = parseInt(req.query.page);
            const isAtTheEnd = lastPage(current, totalpages);
            return res.render("platforms", {
              games,
              current,
              totalpages,
              isAtTheEnd,
            });
          }
        });
    }
  } else {
    return fetch(`http://videogame-api.fly.dev/games`)
      .then((response) => response.json())
      .then((result) => {
        const games = result;
        const totalpages = Math.ceil(result.total / 20);
        const current = 1;
        const isAtTheEnd = lastPage(current, totalpages);
        return res.render("listofgames", { games, current, totalpages, isAtTheEnd });
      });
  }
});

app.get("/games/:slug", (req, res) => {
  return fetch(`http://videogame-api.fly.dev/games/${req.params.slug}`)
    .then((result) => result.json())
    .then((platforms) =>
      fetch(`http://videogame-api.fly.dev/games/platforms/${req.params.slug}`)
        .then((result) => result.json())
        .then((game) => res.render("platformslug", { platforms, game })),
    );
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
