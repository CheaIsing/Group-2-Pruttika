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

const getOrganizerDetails = async (req, res) => {
  const id = req.params.id;

  try {
    const query = "SELECT * FROM tbl_organizer WHERE id = ?";
    const data = await executeQuery(query, [id]);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "Organizer not found");
    }

    sendResponse(res, 200, true, "Display organizer details", data[0]);
  } catch (error) {
    console.log(error);
    sendResponse(res, error);
  }
};

const editOrganizer = async (req, res) => {
  const id = req.params.id;
  const {
    organization_name,
    bio,
    business_email,
    business_phone,
    location,
    facebook,
    telegram,
    tiktok,
    linkin,
    status,
  } = req.body;

  try {
    const checkQuery = `
      SELECT id FROM tbl_organizer
      WHERE (business_email = ? OR business_phone = ?) AND id != ?`;

    const existingUser = await executeQuery(checkQuery, [
      business_email,
      business_phone,
      id,
    ]);

    if (existingUser.length > 0) {
      return sendResponse(res, 400, false, "Email or Phone is already in use.");
    }

    let updateQuery = `UPDATE tbl_organizer SET `;
    const params = [];

    if (organization_name) {
      updateQuery += `organization_name = ?, `;
      params.push(organization_name);
    }
    if (bio) {
      updateQuery += `bio = ?, `;
      params.push(bio);
    }
    if (business_email) {
      updateQuery += `business_email = ?, `;
      params.push(business_email);
    }
    if (business_phone) {
      updateQuery += `business_phone = ?, `;
      params.push(business_phone);
    }
    if (location) {
      updateQuery += `location = ?, `;
      params.push(location);
    }
    if (facebook) {
      updateQuery += `facebook = ?, `;
      params.push(facebook);
    }
    if (telegram) {
      updateQuery += `telegram = ?, `;
      params.push(telegram);
    }
    if (tiktok) {
      updateQuery += `tiktok = ?, `;
      params.push(tiktok);
    }
    if (linkin) {
      updateQuery += `linkin = ?, `;
      params.push(linkin);
    }
    if (status) {
      updateQuery += `status = ?, `;
      params.push(status);
    }

    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ` WHERE id = ?`;
    params.push(userId);

    const data = await executeQuery(updateQuery, params);

    if (data.affectedRows === 0) {
      return sendResponse(
        res,
        404,
        false,
        "Organizer not found or no changes made."
      );
    }

    sendResponse(res, 200, true, "Organizer updated successfully.");
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const removeOrganizer = async (req, res) => {
  const id = req.params.id;

  try {
    const query = "SELECT * FROM tbl_organizer WHERE id = ?";
    const data = await executeQuery(query, [id]);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "Organizer not found.");
    }

    const deleteQuery = "DELETE FROM tbl_organizer WHERE id = ?";
    await executeQuery(deleteQuery, [id]);

    sendResponse(res, 200, true, "Remove organizer sucessfully.");
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const adminApproval = async (req, res) => {
  try {
    const requestId = req.params.id;

    const getRequestStatusQuery =
      "SELECT status FROM tbl_organizer_req WHERE id = ?";
    const requestStatusData = await executeQuery(getRequestStatusQuery, [
      requestId,
    ]);

    if (requestStatusData.length === 0) {
      return sendResponse(res, 404, false, "Organizer request not found.");
    }

    const requestStatus = requestStatusData[0].status;

    if (requestStatus !== 1) {
      return sendResponse(
        res,
        400,
        false,
        "Cannot approve request. Status is not pending."
      );
    }

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

    const getRequestQuery =
      "SELECT user_id, status FROM tbl_organizer_req WHERE id = ?";
    const requestData = await executeQuery(getRequestQuery, [requestId]);

    if (requestData.length === 0) {
      return sendResponse(res, 404, false, "Organizer request not found.");
    }

    const { user_id, status } = requestData[0];

    if (status !== 1) {
      return sendResponse(
        res,
        400,
        false,
        "Cannot reject request. Status is not pending."
      );
    }

    const updateRequestQuery =
      "UPDATE tbl_organizer_req SET status = 3, rejection_reason = ? WHERE id = ?";
    await executeQuery(updateRequestQuery, [rejection_reason, requestId]);

    const updateUserQuery = "UPDATE tbl_users SET role = 1 WHERE id = ?";
    await executeQuery(updateUserQuery, [user_id]);

    sendResponse(res, 200, true, "Request rejected successfully.");
  } catch (error) {
    console.error(error);
    handleResponseError(res, error);
  }
};

module.exports = {
  displayRequestOrganizer,
  displayAllOrganizer,
  getOrganizerDetails,
  editOrganizer,
  removeOrganizer,
  adminApproval,
  adminRejection,
};
