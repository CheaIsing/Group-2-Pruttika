const bcrypt = require("bcrypt");
const fs = require("fs");
const moment = require("moment");
const { handleResponseError } = require("../../utils/handleError");
const { executeQuery } = require("../../utils/dbQuery");
const { sendResponse } = require("../../utils/response");

const getNotifications = async (req, res) => {
  const { id: userId = 1 } = req.user;
  const sql = "SELECT * FROM `tbl_notification` WHERE `receiver_id` = ?;";
  try {
    const result = await executeQuery(sql, userId);
    // console.log(res);
    sendResponse(res, 200, true, "Get All Notification Sucessfully.", result);
  } catch (error) {
    handleResponseError(res, error);
  }
};

const getNotification = async (req, res) => {
  const { id: notiId } = req.params;
  const sql = "SELECT * FROM `tbl_notification` WHERE `id` = ?;";
  try {
    const result = await executeQuery(sql, notiId);
    //   console.log(res);
    sendResponse(
      res,
      200,
      true,
      "Get Single Notification Sucessfully.",
      result
    );
  } catch (error) {
    handleResponseError(res, error);
  }
};

const readNotifications = async (req, res) => {
  const { id: userId = 1 } = req.user;
  const sql =
    "UPDATE `tbl_notification` SET `is_read` = 1 WHERE `receiver_id` = ?";
  try {
    const result = await executeQuery(sql, userId);
    //   console.log(res);
    sendResponse(res, 200, true, "Update Read All Notifications Sucessfully.");
  } catch (error) {
    handleResponseError(res, error);
  }
};

const readNotification = async (req, res) => {
  const { id: notiId = 4 } = req.params;
  const { id: userId = 1 } = req.user;

  //   const selectSql = "SELECT * FROM `tbl_notification` WHERE `id` = ?;";

  const sql =
    "UPDATE `tbl_notification` SET `is_read` = 1 WHERE `id` = ? AND `receiver_id` = ?;";
  const params = [notiId, userId];

  try {
    // const noti = await executeQuery(selectSql, notiId);
    const result = await executeQuery(sql, params);
    //   console.log(res);
    sendResponse(
      res,
      200,
      true,
      "Update Read Single Notification Sucessfully."
    );
  } catch (error) {
    handleResponseError(res, error);
  }
};

const unreadNotification = async (req, res) => {
  const { id: notiId = 4 } = req.params;
  const { id: userId = 1 } = req.user;
  const sql =
    "UPDATE `tbl_notification` SET `is_read` = 2 WHERE `id` = ? AND `receiver_id` = ?;";
  const params = [notiId, userId];
  try {
    const result = await executeQuery(sql, params);
    //   console.log(res);
    sendResponse(
      res,
      200,
      true,
      "Update Read Single Notification Sucessfully.",
      result
    );
  } catch (error) {
    handleResponseError(res, error);
  }
};

const deleteNotification = async (req, res) => {
  const { id: notiId = 4 } = req.params;
  const { id: userId = 1 } = req.user;

  const checkSql =
    "SELECT * FROM `tbl_notification` WHERE `id` = ? AND `receiver_id` = ?;";
  const deleteSql =
    "DELETE FROM `tbl_notification` WHERE `id` = ? AND `receiver_id` = ?;";

    const params = [notiId, userId]

  try {
    const notification = await executeQuery(checkSql, params);

    if (notification.length === 0) {
      return sendResponse(
        res,
        404,
        "Notification not found or you are not authorized to delete it."
      );
    }

    await executeQuery(deleteSql, params);
    sendResponse(res, 200, "Delete Notification Successfully.");
  } catch (error) {
    handleResponseError(res, error);
  }
};

const postLink=async (req,res)=>{
  const id=req.params.id;
  const user_id=req.user.id;
  const {event_link}=req.body;
  const regex=/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  try {
    //check validation url
    const validUrl=event_link.match(regex);
    if(!event_link || !validUrl){
      return sendResponse(res,400,false,"Link to join event must be valid url");
    }

    //update link to event
    const sqlUpdateLink=`UPDATE tbl_event SET join_link=? WHERE id=?`;
    await executeQuery(sqlUpdateLink,[event_link,id]);

    //insert notification to guest
    const sqlGetBuyer=`SELECT buyer_id,eng_name
          from tbl_transaction
          LEFT JOIN tbl_event ON tbl_event.id=event_id
          WHERE event_id=? AND status=2
    `;
    const getBuyer= await executeQuery(sqlGetBuyer,[id]);

    const sqlInsertNotification=`INSERT INTO tbl_notification
    (event_id, receiver_id, eng_message,kh_message,sender_id, type_id) 
    VALUES (?,?,?,?,?,?)`;

    getBuyer.forEach(async (item) => {
      // console.log(user.buyer_id);
      const paramsNotification=[
        id,
        item.buyer_id,
        `The link to join the event "${item.eng_name}" is: ${event_link}`,
        `តំណភ្ជាប់ដើម្បីចូលក្នុងព្រឹត្តិការណ៍ "${item.eng_name}" គឺ៖ ${event_link}`,
        user_id,
        7
      ];
      await executeQuery(sqlInsertNotification, paramsNotification);
    });

    sendResponse(res,200,true,"The Link set successfully and notifications sent to guest!")

  } catch (error) {
    handleResponseError(res,error);
  }
}


module.exports = {
  getNotifications,
  getNotification,
  readNotifications,
  readNotification,
  unreadNotification,
  deleteNotification,
  postLink,
};
