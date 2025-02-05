const { executeQuery } = require("../../../utils/dbQuery");
const { handleResponseError } = require("../../../utils/handleError");
const { sendResponse } = require("../../../utils/response");

const displayRequestOrganizer = async (req, res) => {
  try {
    const { status, search } = req.query;
    let {
      page = 1,
      per_page = 50,
      sort_col = "organization_name",
      sort_dir = "asc",
    } = req.query;

    const pageNum = parseInt(page);
    const perPageNum = parseInt(per_page);

    if (isNaN(pageNum) || pageNum < 1)
      return sendResponse(res, 400, false, "Invalid page number.");
    if (isNaN(perPageNum) || perPageNum < 1)
      return sendResponse(res, 400, false, "Invalid per_page value.");

    const sortDirection = sort_dir.toLowerCase() === "desc" ? "DESC" : "ASC";

    let query = `SELECT * FROM tbl_organizer_req`;
    const queryParams = [];

    if (status) {
      query += " WHERE status = ?";
      queryParams.push(status);
    }

    if (search) {
      query += status ? " AND" : " WHERE";
      query += " organization_name LIKE ?";
      queryParams.push(`%${search}%`);
    }

    query += ` ORDER BY ${sort_col} ${sortDirection}`;

    query += " LIMIT ? OFFSET ?";
    queryParams.push(perPageNum, (pageNum - 1) * perPageNum);

    const data = await executeQuery(query, queryParams);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No organizers request found.");
    }

    sendResponse(res, 200, true, "Display all organizers request", data);
  } catch (error) {
    console.error(error);
    handleResponseError(res, error);
  }
};

const displayAllOrganizer = async (req, res) => {
  try {
    const { status, search } = req.query;
    let {
      page = 1,
      per_page = 50,
      sort_col = "organization_name",
      sort_dir = "asc",
    } = req.query;

    const pageNum = parseInt(page);
    const perPageNum = parseInt(per_page);

    if (isNaN(pageNum) || pageNum < 1)
      return sendResponse(res, 400, false, "Invalid page number.");
    if (isNaN(perPageNum) || perPageNum < 1)
      return sendResponse(res, 400, false, "Invalid per_page value.");

    const sortDirection = sort_dir.toLowerCase() === "desc" ? "DESC" : "ASC";

    let query = `SELECT * FROM tbl_organizer`;
    const queryParams = [];

    if (status) {
      query += " WHERE status = ?";
      queryParams.push(status);
    }

    if (search) {
      query += status ? " AND" : " WHERE";
      query += " organization_name LIKE ?";
      queryParams.push(`%${search}%`);
    }

    query += ` ORDER BY ${sort_col} ${sortDirection}`;

    query += " LIMIT ? OFFSET ?";
    queryParams.push(perPageNum, (pageNum - 1) * perPageNum);

    const data = await executeQuery(query, queryParams);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No organizers found.");
    }

    sendResponse(res, 200, true, "Display all organizers", data);
  } catch (error) {
    console.error(error);
    handleResponseError(res, error);
  }
};

const adminApproval = async (req, res) => {
  try {
    const requestId = req.params.id;

    const getUserQuery = "SELECT * FROM tbl_organizer_req WHERE id = ?";
    const userData = await executeQuery(getUserQuery, [requestId]);

    if (userData.length === 0) {
      return sendResponse(res, 404, false, "Organizer request not found.");
    }

    const user = userData[0];

    const insertOrganizerQuery = `
      INSERT INTO tbl_organizer (user_id, organization_name, bio, business_email, business_phone, location, facebook, telegram, tiktok, linkin) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await executeQuery(insertOrganizerQuery, [
      user.user_id,
      user.organization_name,
      user.bio,
      user.business_email,
      user.business_phone,
      user.location,
      user.facebook,
      user.telegram,
      user.tiktok,
      user.linkin,
    ]);

    const updateRequestQuery =
      "UPDATE tbl_organizer_req SET status = 2 WHERE id = ?";
    await executeQuery(updateRequestQuery, [requestId]);

    const updateUserQuery = "UPDATE tbl_users SET role = 2 WHERE id = ?";
    await executeQuery(updateUserQuery, [user.user_id]);

    sendResponse(
      res,
      200,
      true,
      "Request approved successfully. User promoted to organizer and added to tbl_organizer."
    );
  } catch (error) {
    console.error(error);
    handleResponseError(res, error);
  }
};

const adminRejection = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { rejection_reason } = req.body;

    const getUserQuery = "SELECT user_id FROM tbl_organizer_req WHERE id = ?";
    const userData = await executeQuery(getUserQuery, [requestId]);

    if (userData.length === 0) {
      return sendResponse(res, 404, false, "Organizer request not found.");
    }

    const userId = userData[0].user_id;

    const updateRequestQuery =
      "UPDATE tbl_organizer_req SET status = 3, rejection_reason = ? WHERE id = ?";
    await executeQuery(updateRequestQuery, [rejection_reason, requestId]);

    const updateUserQuery = "UPDATE tbl_users SET role = 1 WHERE id = ?";
    await executeQuery(updateUserQuery, [userId]);

    sendResponse(res, 200, true, "Request rejected successfully.");
  } catch (error) {
    console.error(error);
    handleResponseError(res, error);
  }
};

module.exports = {
  displayRequestOrganizer,
  displayAllOrganizer,
  adminApproval,
  adminRejection,
};
