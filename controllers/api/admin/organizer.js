const { executeQuery } = require("../../../utils/dbQuery");
const { handleResponseError } = require("../../../utils/handleError");
const { sendResponse } = require("../../../utils/response");

const displayPendingOrganizer = async (req, res) => {
  try {
    const query = "SELECT * FROM tbl_organizer_req WHERE STATUS = 1";

    const data = await executeQuery(query);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No pending organizer found.");
    }

    sendResponse(res, 200, true, "Display all pending organizers", data);
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const displayAllOrganizer = async (req, res) => {
  try {
    const query = "SELECT * FROM tbl_organizer";

    const data = await executeQuery(query);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No organizer found.");
    }

    sendResponse(res, 200, true, "Display all organizer", data);
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const filterOrganizer = async (req, res) => {
  const status = req.params.status;
  try {
    const query = "SELECT * FROM tbl_organizer_req";

    const data = await executeQuery(query);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No data found.");
    }

    const filterQuery = "SELECT * FROM tbl_organizer_req WHERE status = ?";

    const result = await executeQuery(filterQuery, [status]);

    sendResponse(res, 200, true, `Disply all organizers with status : ${status}`, result);
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
}

const adminApproval = async (req, res) => {
  const user_id=req.user.id;
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

    //insert notification
    const sqlInsertNotification=`INSERT INTO tbl_notification
    (receiver_id, eng_message,kh_message,sender_id,organizer_req_id, type_id) 
    VALUES (?,?,?,?,?,?)`
    const paramsNotification=[
      user.user_id,
      `Congratulations! Your request to become an organizer has been approved. We are excited to have you on board! You can now create and manage events`,
      `អបអរសាទរ! ការដាក់ស្នើរបស់អ្នកដើម្បីក្លាយជាអ្នករៀបចំព្រឹត្តិការណ៍ត្រូវបានយល់ព្រម។ យើងរីករាយដែលមានអ្នកនៅជាមួយ! ពេលនេះអ្នកអាចបង្កើត និងគ្រប់គ្រងព្រឹត្តិការណ៍ផ្ទាល់ខ្លួនបាន​ហើយ។`,
      user_id,
      requestId,
      3
    ];
    await executeQuery(sqlInsertNotification,paramsNotification);

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
  const sender_id=req.user.id;
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

    //insert notification
    const sqlInsertNotification=`INSERT INTO tbl_notification
    (receiver_id, eng_message,kh_message,sender_id,organizer_req_id, type_id) 
    VALUES (?,?,?,?,?,?)`;
    const paramsNotification=[
      userId,
      `We regret to inform you that your request to become an organizer has been rejected.Reason: ${rejection_reason}. We appreciate your interest and hope you consider applying again.`,
      `យើងសោកស្ដាយក្នុងការជូនដំណឹងដល់អ្នកថាសំណើរបស់អ្នកដើម្បីក្លាយជាអ្នករៀបចំត្រូវបានបដិសេធ។ ហេតុផល៖ ${rejection_reason}។ យើងសូមកោតសរសើរចំពោះចំណាប់អារម្មណ៍របស់អ្នក ហើយសង្ឃឹមថាអ្នកពិចារណាដាក់ពាក្យម្តងទៀត។`,
      sender_id,
      requestId,
      4
    ];
    await executeQuery(sqlInsertNotification,paramsNotification);

    sendResponse(res, 200, true, "Request rejected successfully.");
  } catch (error) {
    console.error(error);
    handleResponseError(res, error);
  }
};

module.exports = {
  displayPendingOrganizer,
  displayAllOrganizer,
  filterOrganizer,
  adminApproval,
  adminRejection,
};

