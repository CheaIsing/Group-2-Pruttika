const schedule = require('node-schedule');
const {executeQuery} = require('../utils/dbQuery'); 

// // Function move old notifications to history
// const moveOldNotificationsToHistory = async () => {
//   const queryMove = `
//     INSERT INTO tbl_notification_history (receiver_id, eng_message, kh_message, type_id, is_read, sender_id, event_id, organizer_req_id, ticket_req_id)
//     SELECT receiver_id, eng_message, kh_message, type_id, is_read, sender_id, event_id, organizer_req_id, ticket_req_id
//     FROM tbl_notification
//     WHERE created_at < NOW() - INTERVAL 3 DAY`;

//   const queryDelete = `
//     DELETE FROM tbl_notification
//     WHERE created_at < NOW() - INTERVAL 3 DAY`;

//   try {
//     await executeQuery(queryMove);
//     await executeQuery(queryDelete);
//     console.log("Old notifications moved to history successfully.");
//   } catch (error) {
//     console.error("Error moving old notifications:", error);
//   }
// };

const deleteNotification = async () => {
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

// Schedule the job to run every day at midnight
// schedule.scheduleJob('0 0 * * *', moveOldNotificationsToHistory);
schedule.scheduleJob('0 0 * * *', deleteNotification);

// Optional: Log when the job starts
// console.log('Scheduled job to move old notifications set to run every day at midnight.');