const bcrypt = require("bcrypt");
const fs = require("fs");
const moment = require("moment");
const { handleResponseError } = require("../../utils/handleError");
const { executeQuery } = require("../../utils/dbQuery");
const { sendResponse } = require("../../utils/response");

const defaultAvatar = "default.jpg";

const updateOwnInfo = async (req, res) => {
  const { kh_name, eng_name, email, phone, dob, gender, address, role } =
    req.body;
  const userId = req.user.id;

  try {
    const checkQuery = `
      SELECT id FROM tbl_users 
      WHERE (email = ? OR phone = ?) AND id != ?`;

    const existingUser = await executeQuery(checkQuery, [email, phone, userId]);

    if (existingUser.length > 0) {
      return sendResponse(res, 400, false, "Email or Phone is already in use.");
    }

    const updateQuery = `
      UPDATE tbl_users SET kh_name = ?, eng_name = ?, email = ?, phone = ?, dob = ?, 
      gender = ?, address = ?, role = ? WHERE id = ?`;

    const params = [
      kh_name,
      eng_name,
      email,
      phone,
      dob,
      gender,
      address,
      role,
      userId,
    ];
    const data = await executeQuery(updateQuery, params);

    if (data.affectedRows === 0) {
      return sendResponse(res, 404, false, "User not found.");
    }

    sendResponse(res, 200, true, "Profile updated successfully.");
  } catch (error) {
    handleResponseError(res, error);
  }
};


const updateOwnPassword = async (req, res) => {
  const { oldPass, newPass, newPassConfirm } = req.body;
  const userId = req.user.id;

  try {
    const querySql = "SELECT password FROM tbl_users WHERE id = ?";
    const data = await executeQuery(querySql, [userId]);

    if (data.length === 0)
      return sendResponse(res, 404, false, "User not found.");

    const storedHashedPass = data[0].password;
    const isMatch = await bcrypt.compare(oldPass, storedHashedPass);
    if (!isMatch)
      return sendResponse(res, 401, false, "Old password is incorrect.");

    if (newPass !== newPassConfirm)
      return sendResponse(res, 400, false, "Passwords do not match.");

    const newHashedPass = await bcrypt.hash(newPass, 10);
    const updateSql = "UPDATE tbl_users SET password = ? WHERE id = ?";
    const params = [newHashedPass, userId];

    await executeQuery(updateSql, params);

    sendResponse(res, 200, true, "Password updated successfully.");
  } catch (error) {
    handleResponseError(res, error);
  }
};

const updateOwnProfileImage = async (req, res) => {
  const userId = req.user.id;

  try {
    if (!req.files || !req.files.avatar)
      return sendResponse(res, 400, false, "No file uploaded.");

    const uploadPath = "./public/uploads/";
    const avatar = req.files.avatar;
    const avatarName = moment().format("YYYYMMDDHHmmss") + avatar.name;
    const filePath = uploadPath + avatarName;

    const querySql = "SELECT avatar FROM tbl_users WHERE id = ?";
    const data = await executeQuery(querySql, [userId]);

    if (data.length === 0)
      return sendResponse(res, 404, false, "User not found.");

    const oldAvatar = data[0].avatar;

    avatar.mv(filePath, async (err) => {
      if (err) return sendResponse(res, 500, false, "File upload failed.");

      const updateSql = "UPDATE tbl_users SET avatar = ? WHERE id = ?";
      const params = [avatarName, userId];

      const updateResult = await executeQuery(updateSql, params);

      if (updateResult.affectedRows === 0)
        return sendResponse(res, 404, false, "User not found.");

      if (oldAvatar && oldAvatar !== defaultAvatar) {
        fs.unlink(`${uploadPath}${oldAvatar}`, (err) => {
          if (err) {
            return sendResponse(res, 400, false, "Error deleting old avatar");
          }
        });
      }

      sendResponse(res, 200, true, "Avatar updated successfully.", avatarName);
    });
  } catch (error) {
    handleResponseError(res, error);
  }
};

const deleteOwnProfileImage = async (req, res) => {
  const userId = req.user.id;

  try {
    const querySql = "SELECT avatar FROM tbl_users WHERE id = ?";
    const data = await executeQuery(querySql, [userId]);

    if (data.length === 0)
      return sendResponse(res, 404, false, "User not found.");

    const avatarPath = data[0].avatar;

    if (!avatarPath)
      return sendResponse(res, 400, false, "No avatar found for this user.");

    if (avatarPath !== defaultAvatar) {
      fs.unlink(`./public/uploads/${avatarPath}`, async (err) => {
        if (err)
          return sendResponse(
            res,
            500,
            false,
            "Error deleting the avatar image."
          );

        const updateSql = "UPDATE tbl_users SET avatar = ? WHERE id = ?";
        const params = [defaultAvatar, userId];
        const updateResult = await executeQuery(updateSql, params);

        if (updateResult.affectedRows === 0)
          return sendResponse(res, 404, false, "User not found.");

        sendResponse(res, 200, true, "Avatar deleted and reset to default.");
      });
    } else {
      sendResponse(res, 200, true, "Avatar is already set to default.");
    }
  } catch (error) {
    handleResponseError(res, error);
  }
};

const deleteOwnAccount = async (req, res) => {
  const { currentPass } = req.body;
  const userId = req.user.id;

  try {
    const querySql = "SELECT password, avatar FROM tbl_users WHERE id = ?";
    const data = await executeQuery(querySql, [userId]);

    if (data.length === 0)
      return sendResponse(res, 404, false, "User not found.");

    const storedHashedPass = data[0].password;
    const isMatch = await bcrypt.compare(currentPass, storedHashedPass);

    if (!isMatch)
      return sendResponse(res, 401, false, "Current password is incorrect.");

    const avatarPath = data[0].avatar;
    if (avatarPath) {
      fs.unlink(`./public/uploads/${avatarPath}`, (err) => {
        if (err)
          return sendResponse(
            res,
            500,
            false,
            "Error deleting the avatar image."
          );
      });
    }

    const deleteSql = "DELETE FROM tbl_users WHERE id = ?";

    const result = await executeQuery(deleteSql, [userId]);

    if (result.affectedRows === 0)
      return sendResponse(res, 404, false, "User not found.");

    sendResponse(res, 200, true, "Account deleted successfully.");
  } catch (error) {
    handleResponseError(res, error);
  }
};

module.exports = {
  updateOwnInfo,
  updateOwnPassword,
  updateOwnProfileImage,
  deleteOwnProfileImage,
  deleteOwnAccount,
};
