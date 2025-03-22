const { executeQuery } = require("../../../utils/dbQuery");
const { handleResponseError } = require("../../../utils/handleError");
const { sendResponse } = require("../../../utils/response");

const displayAllUsers = async (req, res) => {
  try {
    const { role = null, search = null } = req.query;
    let {
      page = 1,
      per_page = 50,
      sort_col = "created_at",
      sort_dir = "asc",
    } = req.query;

    const pageNum = parseInt(page);
    const perPageNum = parseInt(per_page);

    if (isNaN(pageNum) || pageNum < 1) {
      return sendResponse(res, 400, false, "Invalid page number.");
    }

    if (isNaN(perPageNum) || perPageNum < 1) {
      return sendResponse(res, 400, false, "Invalid per_page value.");
    }

    const validSortColumns = ["id", "eng_name", "created_at", "email", "role"];
    if (!validSortColumns.includes(sort_col)) {
      sort_col = "created_at";
    }

    const sortDirection = sort_dir.toLowerCase() === "desc" ? "DESC" : "ASC";

    let query = "SELECT * FROM tbl_users WHERE role != 3";
    let countQuery = "SELECT COUNT(*) AS total FROM tbl_users WHERE role != 3";
    let queryParams = [];
    let countQueryParams = []; // Separate query params for count query

    let whereClause = [];

    if (role && role != 3) {
      whereClause.push("role = ?");
      queryParams.push(role);
      countQueryParams.push(role); // Add to count query params
    }

    if (search) {
      whereClause.push("eng_name LIKE ?");
      queryParams.push(`%${search}%`);
      countQueryParams.push(`%${search}%`); // Add to count query params
    }

    if (whereClause.length > 0) {
      query += " AND " + whereClause.join(" AND ");
      countQuery += " AND " + whereClause.join(" AND ");
    }

    query += ` ORDER BY ${sort_col} ${sortDirection} LIMIT ? OFFSET ?`;
    queryParams.push(perPageNum, (pageNum - 1) * perPageNum);

    const [data, countResult] = await Promise.all([
      executeQuery(query, queryParams),
      executeQuery(countQuery, countQueryParams), // Use countQueryParams
    ]);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / perPageNum);

    sendResponse(res, 200, true, "Display all users", {
      users: data,
      pagination: {
        total,
        current_page: pageNum,
        per_page: perPageNum,
        total_pages: totalPages,
      },
    });
  } catch (error) {
    console.error(error);
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
