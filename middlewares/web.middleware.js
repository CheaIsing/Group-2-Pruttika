const jwt = require("jsonwebtoken");
const { executeQuery } = require("../utils/dbQuery");

const requireAuthWeb = async (req, res, next) => {
  try {
    const token = req.cookies.jwtToken;

    if (!token) {
      req.user = null;
      return next();
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);
    req.user = { id: decodedToken.id };

    const query = "SELECT role FROM tbl_users WHERE id = ?";
    const user = await executeQuery(query, [decodedToken.id]);

    if (user.length === 0) {
      req.user = null;
      return next();
    }
    req.user.role = user[0].role;
    next();
  } catch (error) {
    console.log(error);

    req.user = null;
    next();
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect("/auth/signin"); // Redirect to login if not authenticated
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.redirect("/"); // Redirect if user doesn't have the required role
    }

    next(); // Proceed if authenticated and authorized
  };
};

const preventFromAuthorize = (req, res, next) => {
  const user = req.user; // Access user info from req.user
  console.log(user);

  if (user) {
    if (user.role == 2 || user.role == 1) {
      return res.redirect("/homepage");
    } else if (user.role == 3) {
      return res.redirect("/admin");
    }
  }

  next(); // Proceed if user is not authenticated
};

module.exports = { requireAuthWeb, authorize, preventFromAuthorize };
