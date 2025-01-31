const { executeQuery } = require("../../../utils/dbQuery");
const { handleResponseError } = require("../../../utils/handleError");
const { sendResponse } = require("../../../utils/response");

const filterByRole = async (req, res) => {
  const roleId = req.params.id;

  try {
    const query = "SELECT * FROM tbl_users WHERE role = ?";
    const data = await executeQuery(query, [roleId]);
    sendResponse(res, 200, true, "Filter by role", data);
  } catch (error) {
    console.error(error);
    handleResponseError(res, error);
  }
};

const searchUser = async (req, res) => {
  const { name, email } = req.query;

  try {
    if (!name && !email) {
      return sendResponse(
        res,
        400,
        false,
        "At least one of name or email query parameters is required."
      );
    }

    let query = "SELECT * FROM tbl_users WHERE 1";
    const params = [];

    if (name) {
      query += " AND (eng_name LIKE ? OR email LIKE ?)";
      params.push(`%${name}%`, `%${name}%`);
    }

    if (email) {
      query += " AND email LIKE ?";
      params.push(`%${email}%`);
    }

    const data = await executeQuery(query, params);
    sendResponse(res, 200, true, "Search results", data);
  } catch (error) {
    console.error(error);
    handleResponseError(res, error);
  }
};

const sortByRegisterDate = async (req, res) => {
  try {
    const query = "SELECT * FROM tbl_users ORDER BY created_at DESC";
    const data = await executeQuery(query);
    sendResponse(res, 200, true, "Users sorted by registration date", data);
  } catch (error) {
    console.error(error);
    handleResponseError(res, error);
  }
};

const editUser = async (req, res) => {
  const userId = req.params.id;

  const { kh_name, eng_name, email, phone, dob, gender, address, role } =
    req.body;

  try {
    const query = `
      UPDATE tbl_users SET kh_name = ?, eng_name = ?, email = ?, phone = ?, dob = ?, gender = ?, address = ?, role = ? WHERE id = ?;
    `;

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

    const result = await executeQuery(query, params);

    if (result.affectRows === 0) {
      return sendResponse(
        res,
        404,
        false,
        "User not found or no changes made."
      );
    }

    sendResponse(res, 200, true, "User details updated sucessfully");
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const getUserDetails = async (req, res) => {
  const userId = req.params.id;

  try {
    const query = "SELECT * FROM tbl_users WHERE id = ?";
    const data = await executeQuery(query, [userId]);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "User not found.");
    }

    sendResponse(res, 200, true, "User details fetched sucessfully", data[0]);
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const deactivateUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const query = `UPDATE tbl_users SET STATUS = 2 WHERE id = ?`;

    const data = await executeQuery(query, [userId]);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "uUser not found or already inactive.");
    }

    res.cookie("jwtToken", "", { maxAge: 1 });

    sendResponse(res, 200, true, "User deactivated successfully.");
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

module.exports = {
  filterByRole,
  searchUser,
  sortByRegisterDate,
  editUser,
  getUserDetails,
  deactivateUser
};
