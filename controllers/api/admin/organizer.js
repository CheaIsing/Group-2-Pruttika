const { emitOrganizerApprovalNotification, emitOrganizerRejectionNotification } = require("../../../socket/socketHelper");
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

    const countQuery =
      `SELECT COUNT(*) AS total FROM tbl_organizer_req` +
      (status ? " WHERE status = ?" : "");
    const countParams = status ? [status] : [];

    const countResult = await executeQuery(countQuery, countParams);
    const total = countResult[0].total;

    query += ` ORDER BY ${sort_col} ${sortDirection}`;
    query += " LIMIT ? OFFSET ?";
    queryParams.push(perPageNum, (pageNum - 1) * perPageNum);

    const data = await executeQuery(query, queryParams);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No organizers request found.");
    }

    const totalPages = Math.ceil(total / perPageNum);

    sendResponse(res, 200, true, "Display all organizers request", {
      data: data,
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

    // Base query
    let query = `SELECT * FROM tbl_organizer`;
    let countQuery = `SELECT COUNT(*) AS total FROM tbl_organizer`;
    const queryParams = [];
    const countParams = [];

    // Apply filters
    if (status) {
      query += " WHERE status = ?";
      countQuery += " WHERE status = ?";
      queryParams.push(status);
      countParams.push(status);
    }

    if (search) {
      query += status ? " AND" : " WHERE";
      query += " organization_name LIKE ?";
      countQuery += status ? " AND" : " WHERE";
      countQuery += " organization_name LIKE ?";
      queryParams.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    // Execute count query
    const countResult = await executeQuery(countQuery, countParams);
    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / perPageNum);

    // Apply sorting and pagination
    query += ` ORDER BY ${sort_col} ${sortDirection} LIMIT ? OFFSET ?`;
    queryParams.push(perPageNum, (pageNum - 1) * perPageNum);

    // Execute data query
    const data = await executeQuery(query, queryParams);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No organizers found.");
    }

    sendResponse(res, 200, true, "Display all organizers", {
      data,
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


const getRequestOrganizerDetails = async (req, res) => {
  const id = req.params.id;

  try {
    const query = "SELECT * FROM tbl_organizer_req WHERE id = ?";
    const data = await executeQuery(query, [id]);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "Request organizer not found");
    }

    sendResponse(res, 200, true, "Display request organizer details", data[0]);
  } catch (error) {
    console.log(error);
    sendResponse(res, error);
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
    params.push(id);

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
  const user_id = req.user.id;
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

    //insert notification
    const sqlInsertNotification = `INSERT INTO tbl_notification
    (receiver_id, eng_message,kh_message,sender_id,organizer_req_id, type_id) 
    VALUES (?,?,?,?,?,?)`;
    const paramsNotification = [
      user.user_id,
      `Congratulations! Your request to become an organizer has been approved. We are excited to have you on board! You can now create and manage events`,
      `អបអរសាទរ! ការដាក់ស្នើរបស់អ្នកដើម្បីក្លាយជាអ្នករៀបចំព្រឹត្តិការណ៍ត្រូវបានយល់ព្រម។ យើងរីករាយដែលមានអ្នកនៅជាមួយ! ពេលនេះអ្នកអាចបង្កើត និងគ្រប់គ្រងព្រឹត្តិការណ៍ផ្ទាល់ខ្លួនបាន​ហើយ។`,
      user_id,
      requestId,
      3,
    ];
    await executeQuery(sqlInsertNotification, paramsNotification);

    const io = req.app.get('io');
    emitOrganizerApprovalNotification(io, user.user_id, requestId);

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
  const sender_id = req.user.id;
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

    //insert notification
    const sqlInsertNotification = `INSERT INTO tbl_notification
    (receiver_id, eng_message,kh_message,sender_id,organizer_req_id, type_id) 
    VALUES (?,?,?,?,?,?)`;
    const paramsNotification = [
      user_id,
      `We regret to inform you that your request to become an organizer has been rejected.Reason: ${rejection_reason}. We appreciate your interest and hope you consider applying again.`,
      `យើងសោកស្ដាយក្នុងការជូនដំណឹងដល់អ្នកថាសំណើរបស់អ្នកដើម្បីក្លាយជាអ្នករៀបចំត្រូវបានបដិសេធ។ ហេតុផល៖ ${rejection_reason}។ យើងសូមកោតសរសើរចំពោះចំណាប់អារម្មណ៍របស់អ្នក ហើយសង្ឃឹមថាអ្នកពិចារណាដាក់ពាក្យម្តងទៀត។`,
      sender_id,
      requestId,
      4,
    ];
    await executeQuery(sqlInsertNotification, paramsNotification);

    const io = req.app.get('io');
    emitOrganizerRejectionNotification(io, user_id, requestId, rejection_reason);

    sendResponse(res, 200, true, "Request rejected successfully.");
  } catch (error) {
    console.error(error);
    handleResponseError(res, error);
  }
};

module.exports = {
  displayRequestOrganizer,
  displayAllOrganizer,
  getRequestOrganizerDetails,
  getOrganizerDetails,
  editOrganizer,
  removeOrganizer,
  adminApproval,
  adminRejection,
};
