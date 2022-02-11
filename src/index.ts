import express from "express";
import nunjucks from "nunjucks";
import cookie from "cookie";
import { v4 as uuidv4 } from "uuid";

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

// Home page //
app.get("/", (request, response) => {
  const cookies = cookie.parse(request.get("cookie") || "");
  let user = null;

  fakeBdd.forEach((element) => {
    if (element.cookie === cookies.loggedCookie) {
      user = element;
    }
  });

  response.render("home", { user });
});

// Login page //
app.get("/login", (request, response) => {
  const cookies = cookie.parse(request.get("cookie") || "");

  if (cookies.loggedCookie !== undefined) {
    response.redirect("/");
  } else {
    response.render("login");
  }
});

// Private page //
app.get("/private", (request, response) => {
  const cookies = cookie.parse(request.get("cookie") || "");
  let user = null;

  fakeBdd.forEach((element) => {
    if (element.cookie === cookies.loggedCookie) {
      user = element;
    }
  });

  if (cookies.loggedCookie !== undefined) {
    response.render("private", { user });
  } else {
    response.redirect("/login");
  }
});

// Connection //
app.post("/handleLogin", formParser, (request, response) => {
  const requestBody = request.body;

  fakeBdd.forEach((element) => {
    if (element.username === requestBody.name && element.password === requestBody.password) {
      const cookieValue = uuidv4();
      response.set(
        "Set-Cookie",
        cookie.serialize("loggedCookie", cookieValue, {
          maxAge: 3600,
        }),
      );
      element.cookie = cookieValue;
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

// Deconnection //
app.get("/disconnect", (request, response) => {
  const cookies = cookie.parse(request.get("cookie") || "");

  fakeBdd.forEach((element) => {
    if (element.cookie === cookies.loggedCookie) {
      element.cookie = null;
    }
  });

  response.set(
    "Set-Cookie",
    cookie.serialize("loggedCookie", "", {
      maxAge: 0,
    }),
  );
  response.redirect("/");
});

// Darkmode option //
app.get("/darkMode", (request, response) => {
  const cookies = cookie.parse(request.get("cookie") || "");

  fakeBdd.forEach((element) => {
    if (element.cookie === cookies.loggedCookie) {
      if (element.darkMode) {
        element.darkMode = false;
      } else {
        element.darkMode = true;
      }
    }
  });

  response.redirect("/private");
});

// Register page //
app.get("/register", (request, response) => {
  response.render("register");
});

// Create account //
app.post("/createAccount", formParser, (request, response) => {
  const requestBody = request.body;
  let isAlreadyRegistered = false;

  fakeBdd.forEach((element) => {
    if (element.username === requestBody.name) {
      console.log(isAlreadyRegistered);
      return (isAlreadyRegistered = true);
    }
  });

  console.log(isAlreadyRegistered);
  if (isAlreadyRegistered) {
    response.redirect("/register");
    isAlreadyRegistered = false;
  } else {
    fakeBdd.push({
      username: requestBody.name,
      password: requestBody.password,
      id: 6,
      cookie: null,
      darkMode: false,
    });

    response.redirect("/login");
  }
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
