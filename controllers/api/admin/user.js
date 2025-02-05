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
      sort_dir = "asc"
    } = req.query;

    const pageNum = parseInt(page);
    const perPageNum = parseInt(per_page);

    if (isNaN(pageNum) || pageNum < 1) {
      return sendResponse(res, 404, false, "Invalid page number.");
    }

    if (isNaN(perPageNum) || perPageNum < 1) {
      return sendResponse(res, 404, false, "Invalid per_page value");
    }

    const sortDirection = sort_dir.toLowerCase() === 'desc' ? 'DESC' : 'ASC'; 

    let query = "SELECT * FROM tbl_users";
    const queryParams = [];

    if (role) {
      query += ' WHERE role = ?';
      queryParams.push(role);
    }

    if (search) {
      query += role? ' AND' : ' WHERE';
      query += ' eng_name LIKE ?';
      queryParams.push(`%${search}%`)
    }

    query += ` ORDER BY ${sort_col} ${sortDirection}`;

    query += ' LIMIT ? OFFSET ?';

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
    const query = `UPDATE tbl_users SET status = 2 WHERE id = ?`;

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
  displayAllUsers,
  editUser,
  getUserDetails,
  deactivateUser
};
