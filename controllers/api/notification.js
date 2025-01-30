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

module.exports = {
  getNotifications,
  getNotification,
  readNotifications,
  readNotification,
  unreadNotification,
  deleteNotification,
};
