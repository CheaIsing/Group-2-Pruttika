require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const middleware = require("i18next-http-middleware");
const i18next = require("./config/i18n");
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
const apiOrganizer = require("./routes/api/organizer");

const apiNotification = require("./routes/api/notification");

const apiEvents=require('./routes/api/event');
const apiTickets=require('./routes/api/ticket');

// WEB
const webAuth = require("./routes/web/auth");
const webEvent = require("./routes/web/event");
const webProfile = require("./routes/web/profile");
const webTicket = require('./routes/web/ticket')
const webAdminDashboard = require("./routes/web/admin/index");
const webAdminUser = require('./routes/web/admin/user');
const webAdminOrganizer = require("./routes/web/admin/organizer");
const webAdminEvent = require("./routes/web/admin/event");


const app = express();

app.set("view engine", "ejs");

app.use(cookieParser());
app.use(fileUpload());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middleware.handle(i18next));


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
app.use("/api/organizer", apiOrganizer);
app.use("/api/notification", apiNotification);
app.use("/api/events", apiEvents);
app.use("/api/tickets", apiTickets);

app.get("/", (req, res) => res.redirect("/auth/signin"));

app.use("/auth", webAuth);
app.use("/event", webEvent);
app.use("/profile", webProfile);
app.use('/ticket', webTicket)


app.use("/admin", webAdminDashboard);
app.use("/admin/user", webAdminUser);
app.use("/admin/organizer", webAdminOrganizer);
app.use("/admin/event", webAdminEvent);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
