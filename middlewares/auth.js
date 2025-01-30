const jwt = require("jsonwebtoken");
const con = require("../config/db");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwtToken;
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        res.json({
          message: "Invalid Loggin",
        });
      } else {
        req.user = { id: decodedToken.id };
        next();
      }
    });
  } else {
    console.log("Is not logged in");
    res.json({
      message: "You need to log in",
    });
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwtToken;
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.redirect("/signin");
      } else {
        con.query(
          "select * from tbl_users where id = ?",
          decodedToken.id,
          (err, data) => {
            if (err) {
              console.log(err);
            }
            res.locals.user = data;
            next();
          }
        );
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
module.exports = {
  requireAuth,
  checkUser,
};
