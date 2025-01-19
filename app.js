require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { checkUser, requireAuth } = require("./middlewares/auth");

// API
const apiAuth = require("./routes/api/auth");

// WEB
const webAuth = require("./routes/web/auth");

const app = express();

app.set("view engine", "ejs");

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("*", checkUser);

// API
app.use(apiAuth);

// WEB
app.get("/", requireAuth, (req, res) => {
  res.render("index");
});

app.use(webAuth);

const PORT = process.env.PORT | 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
