const jwt = require("jsonwebtoken");
const { executeQuery } = require("../utils/dbQuery");
const { sendResponse } = require("../utils/response");
const { handleResponseError } = require("../utils/handleError");

const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwtToken;

    if (!token) {
      return sendResponse(res, 401, false, "Unauthorized: No token provided.");
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);
    req.user = { id: decodedToken.id };

    const query = "SELECT role FROM tbl_users WHERE id = ?";
    const user = await executeQuery(query, [decodedToken.id]);

    if (user.length === 0) {
      return sendResponse(res, 404, false, "User not found.");
    }

    req.user.role = user[0].role;
    next();
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

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return sendResponse(res, 403, false, "Unauthorized: No role assigned.");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendResponse(
        res,
        403,
        false,
        "Forbidden: You do not have permission."
      );
    }

    next();
  };
};

module.exports = { requireAuth, checkUser, checkRole };
