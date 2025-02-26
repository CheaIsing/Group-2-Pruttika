const schedule = require('node-schedule');
const {executeQuery} = require('../utils/dbQuery'); 

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

// Schedule the job to run every day at midnight
schedule.scheduleJob('0 0 * * *', deleteNotification);

// console.log('Scheduled job to delete old notifications set to run every day at 12:00 AM.');

module.exports = { deleteNotification };