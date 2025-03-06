const schedule = require('node-schedule');
const {executeQuery} = require('../utils/dbQuery'); 
const io = require('../socket/socket');

const deleteNotification = async () => {
    console.log("Scheduled job running..."); // Add this line
  const queryDelete = `
    DELETE FROM tbl_notification
    WHERE created_at < NOW() - INTERVAL 3 DAY`;

  try {
    await executeQuery(queryDelete);
    console.log("Delete notification successfully.");
  } catch (error) {
    console.error("Error Remove notifications:", error);
  }
};


const sendEventReminders = async () => {
    console.log("Event reminder job running...");

    try {
        // Fetch events starting within the next day
        const eventsQuery = `
            SELECT e.id AS event_id, e.eng_name, e.event_type, e.started_date
            FROM tbl_event e
            WHERE e.started_date BETWEEN CURDATE() AND CURDATE() + INTERVAL 1 DAY
        `;
        const events = await executeQuery(eventsQuery);

        for (const event of events) {
            // Fetch approved buyers for the event (using tbl_transaction)
            const buyersQuery = `
                SELECT DISTINCT t.buyer_id
                FROM tbl_transaction t
                WHERE t.event_id = ? AND t.status = 2  -- Use status 2 for approved transactions
            `;
            const buyers = await executeQuery(buyersQuery, [event.event_id]);

            for (const buyer of buyers) {
                // Insert notification into tbl_notification
                const insertQuery = `
                    INSERT INTO tbl_notification (event_id, user_id, type_id, eng_message, kh_message)
                    VALUES (?, ?, ?, ?, ?)
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

                await executeQuery(insertQuery, [event.event_id, buyer.buyer_id, 6, engMessage, khMessage]);

                // Emit notification through Socket.IO
                emitNotificationForReminder(io, buyer.buyer_id, event.event_id, engMessage, khMessage, 6);

                // Delay before sending the next notification (adjust as needed)
                await new Promise(resolve => setTimeout(resolve, 2000)); // 100ms delay
            }
        }

        console.log("Event reminders sent successfully.");

    } catch (error) {
        console.error("Error sending event reminders:", error);
    }
};

// Schedule the job to run every day at a specific time (e.g., 9:00 AM)
schedule.scheduleJob('0 11 * * *', sendEventReminders)

// Schedule the job to run every day at midnight
schedule.scheduleJob('0 0 * * *', deleteNotification);

// console.log('Scheduled job to delete old notifications set to run every day at 12:00 AM.');

module.exports = { deleteNotification, sendEventReminders };