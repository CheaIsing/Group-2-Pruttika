const { handleResponseError } = require("../../utils/handleError");
const { executeQuery } = require("../../utils/dbQuery");
const { sendResponse } = require("../../utils/response");

const promoteToOrganizer = async (req, res) => {
  const user_id = req.user.id;
  try {
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
    } = req.body;

    const checkExistRequestQuery = `select * from tbl_organizer_req where user_id = ?`;

    const isExistRequest = await executeQuery(checkExistRequestQuery, user_id);
    // console.log(isExistRequest);
    

    if(isExistRequest.length > 0){

        await executeQuery(`delete from tbl_organizer_req where user_id = ?`, isExistRequest[0].user_id);

      
    }

    const query = `INSERT INTO tbl_organizer_req (user_id, organization_name, bio, business_email, business_phone, location, facebook, telegram, tiktok, linkin, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`;

    const result = await executeQuery(query, [
      user_id,
      organization_name,
      bio,
      business_email,
      business_phone,
      location,
      facebook,
      telegram,
      tiktok,
      linkin,
    ]);

    sendResponse(
      res,
      200,
      true,
      "Organizer request submitted successfully",
      result
    );
  } catch (error) {
    // console.error(error);
    handleResponseError(res, error);
  }
};

const displayRequestOrganizerById = async (req, res) => {
  try {
    const {id} = req.user;
    // let id = 3
    // console.log(id);
    
    let sql = "SELECT * FROM tbl_organizer_req WHERE user_id = ?"

    const data = await executeQuery(sql, id);

    if (data.length == 0) {
      return sendResponse(res, 201, false, "No organizers request found.");
    }

    sendResponse(res, 200, true, "Display all organizers request", data);
  } catch (error) {
    // console.error(error);
    handleResponseError(res, error);
  }
};
module.exports = { promoteToOrganizer , displayRequestOrganizerById};
