require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const { checkUser, requireAuth } = require("./middlewares/auth");

// API
const apiAuth = require("./routes/api/auth");
const apiProfile = require("./routes/api/profile");
const apiNotification = require("./routes/api/notification")

const apiEvents=require('./routes/api/event');


// WEB
const webAuth = require("./routes/web/auth");
const webEvent = require("./routes/web/event");

const app = express();

app.set("view engine", "ejs");

app.use(cookieParser());
app.use(fileUpload());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("*", checkUser);

// API
app.use("/api/auth", apiAuth);
app.use("/api/profile", apiProfile);
app.use("/api/notification", apiNotification)
app.use("/api/events",apiEvents);


app.use(webAuth);
app.use(webEvent);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
