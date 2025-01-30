const { executeQuery } = require("../../../utils/dbQuery");
const { handleResponseError } = require("../../../utils/handleError");
const { sendResponse } = require("../../../utils/response");

const displayAllOrganizer = async (req, res) => {
    try {
        const query = "SELECT * FROM tbl_organizer_req";

        const data = executeQuery(query);
        sendResponse(res, 200, true, "Display all organzer", data);
    } catch (error) {
        console.log(error);
        handleResponseError(res, error);
    }
};

const filterByRole = async (req, res) => {
  const roleId = req.params.id;

  try {
    const query = "SELECT * FROM tbl_organizer_req WHERE role = ?";
    const data = await executeQuery(query, [roleId]);
    sendResponse(res, 200, true, "Filter by role", data);
  } catch (error) {
    console.error(error);
    handleResponseError(res, error);
  }
};

const searchOrganizer = async (req, res) => {
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

module.exports = {
    displayAllOrganizer,
    filterByRole
}