const { executeQuery } = require("../../../utils/dbQuery");
const { handleResponseError } = require("../../../utils/handleError");
const { sendResponse } = require("../../../utils/response");
const bcrypt = require("bcrypt");
const moment = require("moment");
const fs = require("fs");

const defaultAvatar = "default.jpg";

const chnageOwnInfo = async (req, res) => {
  const { kh_name, eng_name, email, phone, dob, gender, address } = req.body;
  const userId = req.user.id;

  try {
    const checkQuery = `
      SELECT id FROM tbl_users 
      WHERE (email = ? OR phone = ?) AND id != ?`;

    const existingUser = await executeQuery(checkQuery, [email, phone, userId]);

    if (existingUser.length > 0) {
      return sendResponse(res, 400, false, "Email or Phone is already in use.");
    }

    let updateQuery = `UPDATE tbl_users SET `;
    const params = [];

    if (kh_name) {
      updateQuery += `kh_name = ?, `;
      params.push(kh_name);
    }
    if (eng_name) {
      updateQuery += `eng_name = ?, `;
      params.push(eng_name);
    }
    if (email) {
      updateQuery += `email = ?, `;
      params.push(email);
    }
    if (phone) {
      updateQuery += `phone = ?, `;
      params.push(phone);
    }
    if (dob) {
      updateQuery += `dob = ?, `;
      params.push(dob);
    }
    if (gender) {
      updateQuery += `gender = ?, `;
      params.push(gender);
    }
    if (address) {
      updateQuery += `address = ?, `;
      params.push(address);
    }

    updateQuery = updateQuery.slice(0, -2);

    updateQuery += ` WHERE id = ?`;
    params.push(userId);

    const data = await executeQuery(updateQuery, params);

    if (data.affectedRows === 0) {
      return sendResponse(res, 404, false, "User not found.");
    }

    sendResponse(res, 200, true, "Profile updated successfully.");
  } catch (error) {
    handleResponseError(res, error);
  }
};

const changePassword = async (req, res) => {
  const { oldPass, newPass, passConfirm } = req.body;
  const userId = req.user.id;

  try {
    const query = "SELECT password FROM tbl_users WHERE id = ?";

    const data = await executeQuery(query, [userId]);

    if (data.length === 0) {
      sendResponse(res, 404, false, "User not found.");
    }

    const storedHashedPass = data[0].password;
    const isMatch = await bcrypt.compare(oldPass, storedHashedPass);
    console.log(isMatch);

    if (!isMatch) {
      return sendResponse(res, 401, false, "Old password is incorrect.");
    }

    if (newPass !== passConfirm) {
      return sendResponse(res, 401, false, "Password do not match.");
    }

    const newHashedPass = await bcrypt.hash(newPass, 10);

    const updateQuery = "UPDATE tbl_users SET password = ? WHERE id = ?";

    await executeQuery(updateQuery, [newHashedPass, userId]);

    sendResponse(res, 200, true, "Updated password successfully");
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const chnageAvatar = async (req, res) => {
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
      if (err) {
        // console.error("File upload failed:", err);
        return sendResponse(res, 500, false, "File upload failed.");
      }

      const updateSql = "UPDATE tbl_users SET avatar = ? WHERE id = ?";
      const params = [avatarName, userId];

      const updateResult = await executeQuery(updateSql, params);

      if (updateResult.affectedRows === 0)
        return sendResponse(res, 404, false, "User not found.");

      if (oldAvatar && oldAvatar !== defaultAvatar) {
        fs.unlink(`${uploadPath}${oldAvatar}`, (err) => {
          if (err) {
            // console.error("Error deleting old avatar:", err);
            return sendResponse(res, 400, false, "Error deleting old avatar");
          }
        });
      }

      sendResponse(res, 200, true, "Avatar updated successfully.", avatarName);
    });
  } catch (error) {
    // console.error("Error updating profile image:", error);
    handleResponseError(res, error);
  }
};

const logout = (req, res) => {
  res.cookie("jwtToken", "", { maxAge: 1 });
  sendResponse(res, 200, true, "Logout successfully");
};

module.exports = {
  chnageOwnInfo,
  changePassword,
  chnageAvatar,
  logout,
};
