const conn = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  vSignUp,
  vSignIn,
  vForgotPass,
  vVerifyOTP,
  vResetPass,
} = require("../../validations/auth");

const { sendPasswordResetEmail } = require("../../config/mailer");
const {
  handleDatabaseError,
  handleValidateError,
} = require("../../utils/handleError");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: 3 * 24 * 60 * 60 });
};

const postSignUp = async (req, res) => {
  const { error } = vSignUp.validate(req.body);
  if (handleValidateError(error, res)) return;

  const { name, email, password } = req.body;

  const checkEmailQuery = "SELECT * FROM tbl_user WHERE email = ?";
  conn.query(checkEmailQuery, email, async (err, data) => {
    if (err) {
      return handleDatabaseError(res);
    }

    if (data.length > 0) {
      return res.status(400).json({
        result: false,
        message: "Email already exists. Please use a different email.",
      });
    }

    let salt = await bcrypt.genSalt();
    let hashPassword = await bcrypt.hash(password, salt);

    const sql = "INSERT INTO tbl_user (name, email, password) VALUES (?, ?, ?)";
    const params = [name, email, hashPassword];

    conn.query(sql, params, (err, data) => {
      if (err) {
        return handleDatabaseError(res);
      }

      res.status(201).json({
        result: true,
        message: "User Successfully Created",
      });
    });
  });
};

const postSignIn = (req, res) => {
  const { error } = vSignIn.validate(req.body);
  if (handleValidateError(error, res)) return;

  const { email, password } = req.body;

  const sql = "SELECT * FROM tbl_user WHERE email = ?";
  conn.query(sql, email, async (err, data) => {
    if (err) {
      console.log(err);
      return handleDatabaseError(res);
    }

    if (data.length === 0) {
      return res.status(400).json({
        result: false,
        message: "Incorrect Email.",
      });
    }

    let decryptedPassword = await bcrypt.compare(password, data[0].password);

    if (decryptedPassword) {
      const token = generateToken(data[0].id);
      res.cookie("jwtToken", token, {
        maxAge: 2 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.json({
        result: true,
        message: "Login Successfully",
      });
    } else {
      return res.status(400).json({
        result: false,
        message: "Incorrect Password.",
      });
    }
  });
};

const postForgotPassword = (req, res) => {
  const { error } = vForgotPass.validate(req.body);
  if (handleValidateError(error, res)) return;

  const { email } = req.body;

  const checkUserQuery = "SELECT * FROM tbl_user WHERE email = ?";
  conn.query(checkUserQuery, email, async (err, data) => {
    if (err) {
      return handleDatabaseError(res);
    }

    if (data.length === 0) {
      return res.status(400).json({
        result: false,
        message: "Email not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

    const insertOtpQuery =
      "REPLACE INTO tbl_otp (email, otp, expiration_time) VALUES (?, ?, ?)";
    const params = [email, otp, expirationTime];

    conn.query(insertOtpQuery, params, async (err) => {
      if (err) {
        return handleDatabaseError(res);
      }

      console.log(`OTP stored for ${email}:`, { otp });

      try {
        await sendPasswordResetEmail(email, otp);
        res.json({
          result: true,
          message: "Password reset OTP sent to your email",
        });
      } catch (err) {
        console.error("Email error:", err);
        res.status(500).json({
          result: false,
          message: "Error sending password reset email",
        });
      }
    });
  });
};

const verifyOtp = (req, res) => {
  const { error } = vVerifyOTP.validate(req.body);
  if (handleValidateError(error, res)) return;

  const { email, verifyOtp } = req.body;
  const sql = "SELECT * FROM tbl_otp WHERE email = ?";

  conn.query(sql, email, (err, data) => {
    if (err) {
      return handleDatabaseError(res);
    }

    if (data.length === 0) {
      return res.status(400).json({
        result: false,
        message: "Email Not Found !",
      });
    }

    let otp = data[0].otp;
    let verifyForgotOtp = Number(verifyOtp);

    if (verifyForgotOtp === otp) {
      const updateOtpStatusQuery = `
        UPDATE tbl_otp
        SET otp_verified = 1
        WHERE email = ?
      `;
      conn.query(updateOtpStatusQuery, email, (err) => {
        if (err) {
          return handleDatabaseError(res);
        }
        res.json({
          result: true,
          message:
            "OTP Verified Successfully. You can now reset your password.",
        });
      });
    } else {
      console.log("OTP verification failed");
      return res.status(400).json({
        result: false,
        message: "Invalid OTP",
      });
    }
  });
};

const postResetPassword = async (req, res) => {
  const { error } = vResetPass.validate(req.body);
  if (handleValidateError(error, res)) return;

  const { email, otp, newPassword, confirmNewPassword } = req.body;
  const checkEmailQuery = `SELECT * FROM tbl_user WHERE email = ?`;

  conn.query(checkEmailQuery, email, (err, userData) => {
    if (err) {
      return handleDatabaseError(res);
    }

    if (userData.length === 0) {
      return res.status(400).json({
        result: false,
        message: "Email does not exist",
      });
    }

    const otpQuery = `
      SELECT * FROM tbl_otp
      WHERE email = ? AND otp_verified = 1 AND expiration_time > NOW()
    `;
    conn.query(otpQuery, email, async (err, data) => {
      if (err) {


        return handleDatabaseError(res);
      }

      if (data.length === 0) {
        return res.status(400).json({
          result: false,
          message: "OTP not verified or expired",
        });
      }

      const storedOtp = data[0].otp;
      console.log("Stored OTP:", storedOtp, "Provided OTP:", otp);

      if (otp != storedOtp) {
        return res.status(400).json({
          result: false,
          message: "Invalid OTP",
        });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({
          result: false,
          message: "Passwords do not match",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatePasswordQuery = `
        UPDATE tbl_user SET password = ? WHERE email = ?
      `;
      const params = [hashedPassword, email];

      conn.query(updatePasswordQuery, params, (err) => {
        if (err) {
          return handleDatabaseError(res);
        }

        const deleteOtpQuery = `DELETE FROM tbl_otp WHERE email = ?`;
        conn.query(deleteOtpQuery, email);

        res.json({
          result: true,
          message: "Password successfully reset",
        });
      });
    });
  });
};

const logout = (req, res) => {
  res.cookie("jwtToken", "", { maxAge: 1 });
  res.json({
    result: true,
    message: "Logout Successfully",
  });
};

module.exports = {
  postSignUp,
  postSignIn,
  postForgotPassword,
  verifyOtp,
  postResetPassword,
  logout,
};
