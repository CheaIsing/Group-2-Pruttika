const bcrypt = require("bcrypt");
const fs = require("fs");
const moment = require("moment");
const { handleResponseError } = require("../../utils/handleError");
const { executeQuery } = require("../../utils/dbQuery");
const { sendResponse,sendResponse1 } = require("../../utils/response");
const {ownReqTicketCollection, ownTicketCollection}=require("../../resource/ticket");
const { name } = require("ejs");

const defaultAvatar = "default.jpg";

const getAllProfile = async (req, res) => {
  try {
    const query = "SELECT * FROM tbl_users";

    const data = await executeQuery(query);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No data found.");
    }

    sendResponse(res, 200, true, "Display all users profile.", data);
  } catch (error) {
    console.log(data);
    handleResponseError(res, error);
  }
};

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
    if (role) {
      updateQuery += `role = ?, `;
      params.push(role);
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
      if (err) {
        console.error("File upload failed:", err);
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
            console.error("Error deleting old avatar:", err);
            return sendResponse(res, 400, false, "Error deleting old avatar");
          }
        });
      }

      sendResponse(res, 200, true, "Avatar updated successfully.", avatarName);
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
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

//get own request ticket
const getOwnReqTicket = async (req, res) => {
  const user_id = req.user.id;
  try {
    const data = await ownReqTicketCollection(
      user_id,
      req.query.status,
      req.query.page,
      req.query.per_page,
      req.query.sort,
      req.query.order
    );
    sendResponse1(
      res,
      200,
      true,
      "Get all ticket request successfully",
      data.rows,
      data.paginate
    );
  } catch (error) {}
};

//get own ticket
const getOwnTicket = async (req, res) => {
  const user_id = req.user.id;
  try {
    const data = await ownTicketCollection(
      user_id,
      req.query.status,
      req.query.page,
      req.query.per_page,
      req.query.sort,
      req.query.order
    );
    sendResponse1(
      res,
      200,
      true,
      "Get all owned ticket successfully",
      data.rows,
      data.paginate
    );
  } catch (error) {}
};

const deactivateAccount = async (req, res) => {
  const userId = req.user.id;

  try {
    const query = `UPDATE tbl_users SET status = 2 WHERE id = ?`;

    const data = await executeQuery(query, [userId]);

    if (data.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        "uUser not found or already inactive."
      );
    }

    res.cookie("jwtToken", "", { maxAge: 1 });

    sendResponse(res, 200, true, "User deactivated successfully.");
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const getProfileById = async (req, res) => {
  const id = req.params.id;
  try {
    // const query = "SELECT * FROM tbl_users WHERE id = ?";
    const query = `SELECT 
            tu.*,
              tor.id AS organizer_id,
              tor.organization_name,
              tor.bio,
              tor.business_email,
              tor.business_phone,
              tor.location,
              tor.facebook,
              tor.telegram,
              tor.tiktok,
              tor.linkin,
              tor.status AS org_status,
              tor.created_at AS org_created,
              tor.updated_at AS org_updated
          FROM tbl_users tu
          LEFT JOIN tbl_organizer tor ON tu.id=tor.user_id
          WHERE tu.id=?
    `;

    const data = await executeQuery(query, [id]);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No data found.");
    }

    const User=data[0];
    const dataUser={
      id: User.id,
      kh_name : User.kh_name,
      eng_name: User.eng_name,
      email: User.email,
      phone: User.phone,
      avatar: User.avatar,
      dob: User.dob,
      gender: User.gender,
      address:User.address,
      role: User.role,
      status: User.status,
      Organizer_info:{
        id:User.organizer_id,
        name: User.organization_name,
        bio: User.bio,
        email: User.business_email,
        phone: User.business_phone,
        location: User.location,
        facebook: User.facebook,
        telegram: User.telegram,
        tiktok: User.tiktok,
        linkin: User.linkin,
        status: User.org_status,
        created_at: User.org_created,
        updated_at: User.org_updated
      },
      created_at : User.created_at,
      updated_at : User.updated_at
    };

    sendResponse(res, 200, true, `Display profile detail with id : ${id}`, dataUser);
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
}

module.exports = {
  updateOwnInfo,
  updateOwnPassword,
  updateOwnProfileImage,
  deleteOwnProfileImage,
  deleteOwnAccount,
  getOwnReqTicket,
  getOwnTicket,
  deactivateAccount,
  getProfileById,
};
