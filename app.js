require("dotenv").config();

const http = require("http")
const setUpSocket = require("./socket/socket")
const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const middleware = require("i18next-http-middleware");
const i18next = require("./config/i18n");
const { checkUser, requireAuth } = require("./middlewares/auth");
const schedule = require('node-schedule');
const moment = require('moment');

const { deleteNotification } = require("./job/notification"); //auto delete noti after 3 days

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

const apiEvents = require("./routes/api/event");
const apiTickets = require("./routes/api/ticket");

// WEB
const webStatic = require("./routes/web/static")
const webIndex = require("./routes/web/index")
const webAuth = require("./routes/web/auth");
const webEvent = require("./routes/web/event");
const webProfile = require("./routes/web/profile");
const webTicket = require("./routes/web/ticket");
const webFollow = require("./routes/web/follow");
const webNotification = require("./routes/web/notification");
const webAdminDashboard = require("./routes/web/admin/index");
const webAdminUser = require("./routes/web/admin/user");
const webAdminOrganizer = require("./routes/web/admin/organizer");
const webAdminEvent = require("./routes/web/admin/event");
const webAdminSetting = require("./routes/web/admin/setting");
const { requireAuthWeb } = require("./middlewares/web.middleware");
const webAdminProfile = require("./routes/web/admin/profile");
const { executeQuery } = require("./utils/dbQuery");
const { emitNotificationForReminder, emitNotificationForInputOnlineLink } = require("./socket/socketHelper");
// console.log(moment(new Date).format("YYYY-MM-DD hh:mm:ss"));

const app = express();
const server = http.createServer(app);
const io = setUpSocket(server); 

app.set("io", io);
// --- Your sendEventReminders function ---
const sendEventReminders = async () => {
  console.log("Event reminder job running....");

  try {
      // Fetch events starting within the next day
      const eventsQuery = `
          SELECT e.id AS event_id, e.eng_name, e.event_type, e.started_date
          FROM tbl_event e
          WHERE e.started_date = CURDATE() + INTERVAL 1 DAY
      `;
      const events = await executeQuery(eventsQuery);

      if (events.length > 0) {
          for (const event of events) {
              // Fetch approved buyers for the event (using tbl_transaction)
              const buyersQuery = `
                  SELECT DISTINCT t.buyer_id
                  FROM tbl_transaction t
                  WHERE t.event_id = ? AND t.status = 2  -- Use status 2 for approved transactions
              `;
              const buyers = await executeQuery(buyersQuery, [event.event_id]);

              if (buyers.length > 0) {
                  for (const buyer of buyers) {
                      // Insert notification into tbl_notification
                      const insertQuery = `
                          INSERT INTO tbl_notification (event_id, receiver_id, type_id, sender_id, eng_message, kh_message)
                          VALUES (?, ?, ?, ?, ?, ?)
                      `;

                      let engMessage, khMessage;

                      if (event.event_type === 1) { // Online event
                          engMessage = `Reminder: The online event ${event.eng_name} is starting tomorrow!`;
                          khMessage = `ការរំលឹក: ព្រឹត្តិការណ៍អនឡាញ ${event.eng_name} នឹងចាប់ផ្តើមនៅថ្ងៃស្អែក!`;
                      } else if (event.event_type === 2) { // Offline event
                          engMessage = `Reminder: The offline event ${event.eng_name} is starting tomorrow!`;
                          khMessage = `ការរំលឹក: ព្រឹត្តិការណ៍ក្រៅបណ្តាញ ${event.eng_name} នឹងចាប់ផ្តើមនៅថ្ងៃស្អែក!`;
                      } else {
                          // Handle other event types or log an error
                          console.error("Unknown event type:", event.event_type);
                          continue; // Skip to the next buyer
                      }

                      await executeQuery(insertQuery, [event.event_id, buyer.buyer_id, 6, 1, engMessage, khMessage]);

                      // Emit notification through Socket.IO
                      emitNotificationForReminder(io, buyer.buyer_id, event.event_id, engMessage, khMessage);

                      // Delay before sending the next notification (adjust as needed)
                      await new Promise(resolve => setTimeout(resolve, 2000)); // 100ms delay
                  }
              }
          }
      }

      console.log("Event reminders sent successfully.");

  } catch (error) {
      console.error("Error sending event reminders:", error);
  }
};
async function sendEventLinkReminder(io, eventId, creatorId, eventName) {
    try {
      const message = `Reminder: Please input the event link for "${eventName}" which starts in 10 minutes.`;
      const khMessage = `ការរំលឹក: សូមបញ្ចូលតំណភ្ជាប់ព្រឹត្តិការណ៍សម្រាប់ "${eventName}" ដែលនឹងចាប់ផ្តើមក្នុងរយៈពេល 10 នាទី។`;
  
      const insertNotificationQuery = `
        INSERT INTO tbl_notification (event_id, receiver_id, eng_message, kh_message, sender_id, type_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
  
      await executeQuery(insertNotificationQuery, [eventId, creatorId, message, khMessage, 1, 7]);
  
      emitNotificationForInputOnlineLink(io, creatorId, eventId, message, khMessage);
      console.log(`Reminder sent to creator ${creatorId} for event ${eventId}.`);
  
    } catch (error) {
      console.error(`Error sending event link reminder:`, error);
    }
  }
console.log(moment(new Date).format("YYYY-MM-DD HH:mm:ss"));

async function scheduleEventLinkReminders() {
  try {
    const eventsQuery = `
SELECT id, creator_id, eng_name, started_date, start_time
FROM tbl_event
WHERE event_type = 1
AND DATE_FORMAT(CONCAT(started_date, ' ', start_time), '%Y-%m-%d %H:%i') = DATE_FORMAT(DATE_ADD("${moment(new Date).format("YYYY-MM-DD HH:mm:ss")}", INTERVAL 10 MINUTE), '%Y-%m-%d %H:%i')
    `;

    const events = await executeQuery(eventsQuery);
    // console.log(events);
    

    if (events && events.length > 0) {
      for (const event of events) {
        const eventId = event.id;
        const creatorId = event.creator_id;
        const eventName = event.eng_name;


          await sendEventLinkReminder(io, eventId, creatorId, eventName);

        console.log(`Reminder scheduled for event ${eventId} to be sent immediately.`);
      }
    } else {
      console.log('No online events starting in the next 10 minutes.');
    }
  } catch (error) {
    console.error('Error scheduling event link reminders:', error);
  }
}
// console.log();
// --- End of sendEventReminders function ---

// Schedule the job to run every day at a specific time (e.g., 9:00 AM)
schedule.scheduleJob('* * * * *', scheduleEventLinkReminders);
console.log('Event link reminder scheduler started.');
schedule.scheduleJob('10 14 * * *', sendEventReminders);

app.set("view engine", "ejs");

app.use(cookieParser());
app.use(fileUpload());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middleware.handle(i18next));

//change font
app.use((req, res, next) => {
    let lang = req.cookies.i18next;
    res.locals.lang = "en";

    // Check for query parameter and set cookie if present
    if (req.query.lng && i18next.options.supportedLngs.includes(req.query.lng)) {
        lang = req.query.lng;
        res.cookie('i18next', lang, { maxAge: 900000, httpOnly: true });
    }

    // If cookie is present and supported, use it
    if (lang && i18next.options.supportedLngs.includes(lang)) {
        i18next.changeLanguage(lang);
        res.locals.lang = lang;
    }

    next();
});


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

// Web
app.use(requireAuthWeb);
app.use(webIndex)
app.use(webStatic)
app.use("/auth", webAuth);
app.use("/event", webEvent);
app.use("/profile", webProfile);
app.use("/ticket", webTicket);
app.use("/notification", webNotification);
app.use("/follow", webFollow);

app.use("/admin", webAdminDashboard);
app.use("/admin/user", webAdminUser);
app.use("/admin/organizer", webAdminOrganizer);
app.use("/admin/event", webAdminEvent);
app.use("/admin/setting", webAdminSetting);
app.use("/admin/profile", webAdminProfile);

const PORT = process.env.PORT || 3000;

app.use((req, res) => {
  res.status(404).render("pages/static/404", {title: "404"})
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
