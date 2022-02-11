import express from "express";
import nunjucks from "nunjucks";
import cookie from "cookie";

import fakeBdd from "./fakeBdd";

const app = express();
const formParser = express.urlencoded({ extended: true });
let logged = false;

app.use(express.static("public"));

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");

// HOME PAGE //
app.get("/", (request, response) => {
  const cookies = cookie.parse(request.get("cookie") || "");
  let user = null;

  fakeBdd.forEach((element) => {
    if (element.id === cookies.loggedCookie) {
      user = element;
    }
  });

  response.render("home", { user });
});

// LOGIN PAGE //
app.get("/login", (request, response) => {
  const cookies = cookie.parse(request.get("cookie") || "");

  if (cookies.loggedCookie !== undefined) {
    response.redirect("/");
  } else {
    response.render("login");
  }
});

// PRIVATE PAGE //
app.get("/private", (request, response) => {
  const cookies = cookie.parse(request.get("cookie") || "");
  let user = null;

  fakeBdd.forEach((element) => {
    if (element.id === cookies.loggedCookie) {
      user = element;
    }
  });

  if (cookies.loggedCookie !== undefined) {
    response.render("private", { user });
  } else {
    response.redirect("/login");
  }
});

// CONNECTION //
app.post("/handleLogin", formParser, (request, response) => {
  console.log(request.body);
  const requestBody = request.body;

  fakeBdd.forEach((element) => {
    if (element.username === requestBody.name && element.password === requestBody.password) {
      response.set(
        "Set-Cookie",
        cookie.serialize("loggedCookie", element.id, {
          maxAge: 3600,
        }),
      );
      logged = true;
      return logged;
    } else {
      logged = false;
    }
  });

  if (logged) {
    response.redirect("/");
  } else {
    response.redirect("/login");
  }
});

// DECONNECTION //
app.get("/disconnect", (request, response) => {
  response.set(
    "Set-Cookie",
    cookie.serialize("loggedCookie", "", {
      maxAge: 0,
    }),
  );
  response.redirect("/");
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
