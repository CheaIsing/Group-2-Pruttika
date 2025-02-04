require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { checkUser, requireAuth } = require("./middlewares/auth");

// API
const apiAuth = require("./routes/api/auth");
const apiProfile = require("./routes/api/profile");
const apiAdminUser = require("./routes/api/admin/user");
const apiAdminOrganizer = require("./routes/api/admin/organizer");
const apiAdminEvent = require("./routes/api/admin/event");
const apiAdminSetting = require("./routes/api/admin/setting");
const apiWishList = require("./routes/api/wishlist");
const apiFollow = require("./routes/api/follow");

const apiNotification = require("./routes/api/notification")

const apiEvents=require('./routes/api/event');


// WEB
const webAuth = require("./routes/web/auth");
const webEvent = require("./routes/web/event");
const webProfile = require("./routes/web/profile")

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
app.use("/api/admin/user", apiAdminUser);
app.use("/api/admin/organizer", apiAdminOrganizer);
app.use("/api/admin/event", apiAdminEvent);
app.use("/api/admin/setting", apiAdminSetting);
app.use("/api/wishlist", apiWishList);
app.use("/api/follow", apiFollow);

app.use("/api/notification", apiNotification)
app.use("/api/events",apiEvents);

app.get("/",(req, res)=>res.redirect('/auth/signin'))

app.use("/auth",webAuth);
app.use("/event", webEvent);
app.use("/profile", webProfile);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
