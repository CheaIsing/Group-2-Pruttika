const jwt = require("jsonwebtoken");
const { executeQuery } = require("../utils/dbQuery");
const { sendResponse } = require("../utils/response");
const { handleResponseError } = require("../utils/handleError");

const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies?.jwtToken;

    if (!token) {
      return sendResponse(res, 401, false, "You need to log in");
    }

    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        return sendResponse(res, 403, false, "Invalid Login");
      }

      req.user = { id: decodedToken.id };
      next();
    });
  } catch (error) {
    handleResponseError(res, error);
  }
};

const checkUser = async (req, res, next) => {
  try {
    const token = req.cookies?.jwtToken;

    if (!token) {
      res.locals.user = null;
      return next();
    }

    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        return res.redirect("/signin");
      }

      try {
        const query = "SELECT * FROM tbl_users WHERE id = ?";
        const data = await executeQuery(query, [decodedToken.id]);

        res.locals.user = data.length ? data[0] : null;
        next();
      } catch (dbError) {
        handleResponseError(res, dbError);
      }
    });
  } catch (error) {
    handleResponseError(res, error);
  }
};

module.exports = { requireAuth, checkUser };
