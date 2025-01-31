const { executeQuery } = require("../utils/dbQuery");
const { handleResponseError } = require("../utils/handleError");
const { sendResponse } = require("../utils/response");

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) return sendResponse(res, 401, false, "Unauthorized");

      const query = "SELECT role FROM tbl_users WHERE id = ?";

      const data = await executeQuery(query, [userId]);

      if (data.length === 0)
        return sendResponse(res, 404, false, "User not found");

      const userRole = data[0].role;

      if (!role.includes(userRole)) {
        return sendResponse(res, 404, false, "Access Denied.");
      }

      next();
    } catch (error) {
      console.log(error);
      handleResponseError(res, error);
    }
  };
};

module.exports = { checkRole };