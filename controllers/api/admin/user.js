const { executeQuery } = require("../../../utils/dbQuery");
const { handleResponseError } = require("../../../utils/handleError");
const { sendResponse } = require("../../../utils/response");

const displayAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let {
      page = 1,
      per_page = 50,
      sort_col = "created_at",
      sort_dir = "asc",
    } = req.query;

    const pageNum = parseInt(page);
    const perPageNum = parseInt(per_page);

    if (isNaN(pageNum) || pageNum < 1) {
      return sendResponse(res, 404, false, "Invalid page number.");
    }

    if (isNaN(perPageNum) || perPageNum < 1) {
      return sendResponse(res, 404, false, "Invalid per_page value");
    }

    const sortDirection = sort_dir.toLowerCase() === "desc" ? "DESC" : "ASC";

    let query = "SELECT * FROM tbl_users";
    const queryParams = [];

    if (role) {
      query += " WHERE role = ?";
      queryParams.push(role);
    }

    if (search) {
      query += role ? " AND" : " WHERE";
      query += " eng_name LIKE ?";
      queryParams.push(`%${search}%`);
    }

    query += ` ORDER BY ${sort_col} ${sortDirection}`;

    query += " LIMIT ? OFFSET ?";

    queryParams.push(perPageNum, (pageNum - 1) * perPageNum);

    const data = await executeQuery(query, queryParams);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No users found.");
    }

    sendResponse(res, 200, true, "Display all users", data);
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const editUser = async (req, res) => {
  const id = req.params.id;
  const { kh_name, eng_name, email, phone, dob, gender, adddress } = req.body;

  try {
    const checkQuery = `
      SELECT id FROM tbl_users
      WHERE (email = ? OR phone = ?) AND id != ?`;

    const existingUser = await executeQuery(checkQuery, [email, phone, id]);

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
    if (adddress) {
      updateQuery += `adddress = ?, `;
      params.push(adddress);
    }

    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ` WHERE id = ?`;
    params.push(id);

    const data = await executeQuery(updateQuery, params);

    if (data.affectedRows === 0) {
      return sendResponse(
        res,
        404,
        false,
        "User not found or no changes made."
      );
    }

    sendResponse(res, 200, true, "User updated successfully.");
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

const removeUser = async (req, res) => {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM tbl_users WHERE id = ?";
    const data = await executeQuery(query, [id]);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "User not found.");
    }

    if (data[0].role === 3) {
      return sendResponse(res, 403, false, "Admins cannot be removed.");
    }

    const deleteQuery = "DELETE FROM tbl_users WHERE id = ?";
    await executeQuery(deleteQuery, [id]);

    sendResponse(res, 200, true, "Remove user sucessfully.");
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

module.exports = {
  displayAllUsers,
  editUser,
  getUserDetails,
  removeUser,
};
