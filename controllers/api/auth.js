const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const {
  vSignUp,
  vSignIn,
  vForgotPass,
  vVerifyOTP,
  vResetPass,
} = require("../../validations/auth");
const { sendPasswordResetEmail } = require("../../config/mailer");
const {
  handleResponseError,
  handleValidateError,
} = require("../../utils/handleError");
const { executeQuery } = require("../../utils/dbQuery");
const { sendResponse } = require("../../utils/response");

const defaultAvatar = "default.jpg";

const postSignUp = async (req, res) => {
  const { error } = vSignUp.validate(req.body);
  if (handleValidateError(error, res)) return;

  const { name, email, password } = req.body;
  const { lng = "en" } = req.query;

  try {
    const checkEmailQuery = "SELECT * FROM tbl_users WHERE email = ?";
    const existingUsers = await executeQuery(checkEmailQuery, [email]);

    if (existingUsers.length > 0)
      return sendResponse(
        res,
        400,
        false,
        "Email already exists. Please use a different email."
      );

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    let eng_name = null;
    let kh_name = null;

    if (lng === "en") {
      eng_name = name;
    } else if (lng === "kh") {
      kh_name = name;
    }

    const insertUserQuery =
      "INSERT INTO tbl_users(kh_name, eng_name, email, password, avatar) VALUES (?, ?, ?, ?, ?)";
    const params = [kh_name, eng_name, email, hashPassword, defaultAvatar];

    await executeQuery(insertUserQuery, params);

    sendResponse(res, 201, true, "User created successfully");
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const postSignIn = async (req, res) => {
  const { error } = vSignIn.validate(req.body);
  if (handleValidateError(error, res)) return;

  const { email, password, rememberMe = false } = req.body;

  try {
    const sql = "SELECT * FROM tbl_users WHERE email = ?";
    const data = await executeQuery(sql, [email]);

    if (data.length === 0)
      return sendResponse(res, 400, false, "Invalid Email");

    const user = data[0];

    const isPasswordValid = await bcrypt.compare(password, data[0].password);

    if (isPasswordValid) {
      if (user.status === 2) {
        const updateQuery = "UPDATE tbl_users SET STATUS = 1 WHERE id = ?";
        await executeQuery(updateQuery, [user.id]);
      }

      const tokenExpiration = rememberMe ? 630720000 : 7200; // 20 years or 2 hours
      const token = jwt.sign({ id: data[0].id }, process.env.SECRET, {
        expiresIn: tokenExpiration,
      });

      res.cookie("jwtToken", token, {
        maxAge: rememberMe ? 630720000 * 1000 : 7200 * 1000, // 20 years or 2 hours in milliseconds,
        httpOnly: true,
      });
      sendResponse(res, 200, true, "Login Successfully");
    } else {
      return sendResponse(res, 400, false, "Invalid Password");
    }
  } catch (error) {
    handleResponseError(res, error);
  }
};

const postForgotPassword = async (req, res) => {
  const { error } = vForgotPass.validate(req.body);
  if (handleValidateError(error, res)) return;

  const { email } = req.body;

  try {
    const checkUserQuery = "SELECT * FROM tbl_users WHERE email = ?";
    const data = await executeQuery(checkUserQuery, [email]);

    if (data.length === 0)
      return sendResponse(res, 400, false, "Email not found.");

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expirationTime = moment()
      .add(10, "minutes")
      .format("YYYY-MM-DD HH:mm:ss");

    const insertOtpQuery =
      "REPLACE INTO tbl_otp (email, otp, expiration_time) VALUES (?, ?, ?)";
    await executeQuery(insertOtpQuery, [email, otp, expirationTime]);

    await sendPasswordResetEmail(email, otp);
    sendResponse(res, 200, true, "Password reset OTP send to your email.");
  } catch (error) {
    handleResponseError(res, error);
  }
};

const verifyOtp = async (req, res) => {
  const { error } = vVerifyOTP.validate(req.body);
  if (handleValidateError(error, res)) return;

  const { email, verifyOtp } = req.body;

  try {
    const sql = "SELECT * FROM tbl_otp WHERE email = ?";
    const data = await executeQuery(sql, [email]);

    if (data.length === 0)
      return sendResponse(res, 400, false, "Email not found.");

    const otp = data[0].otp;
    const verifyForgotOtp = Number(verifyOtp);

    if (verifyForgotOtp === otp) {
      const updateOtpStatusQuery = `
        UPDATE tbl_otp
        SET otp_verified = 1
        WHERE email = ?
      `;
      await executeQuery(updateOtpStatusQuery, [email]);
      sendResponse(
        res,
        200,
        true,
        "OTP Verified Successfully. You can now reset your password."
      );
    } else {
      return sendResponse(res, 400, false, "Invalid OTP.");
    }
  } catch (error) {
    handleResponseError(res, error);
  }
};

const postResetPassword = async (req, res) => {
  const { error } = vResetPass.validate(req.body);
  if (handleValidateError(error, res)) return;

  const { email, otp, newPassword, confirmNewPassword } = req.body;

  try {
    const checkUserQuery = "SELECT * FROM tbl_users WHERE email = ?";
    const userData = await executeQuery(checkUserQuery, [email]);

    if (userData.length === 0)
      return sendResponse(res, 400, false, "Email doesn't exist.");

    const otpQuery = `
      SELECT * FROM tbl_otp
      WHERE email = ? AND otp_verified = 1 AND expiration_time > ?
    `;
    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    const data = await executeQuery(otpQuery, [email, now]);

    if (data.length === 0)
      return sendResponse(res, 400, false, "OTP not verified or expired");

    const storedOtp = data[0].otp;

    if (otp != storedOtp) return sendResponse(res, 400, false, "Invalid OTP.");

    if (newPassword !== confirmNewPassword)
      return sendResponse(res, 400, false, "Passwords do not match.");

    const isSameAsOldPassword = await bcrypt.compare(
      newPassword,
      userData[0].password
    );
    if (isSameAsOldPassword)
      return sendResponse(
        res,
        400,
        false,
        "New password cannot be the same as the old password."
      );

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatePasswordQuery = `
      UPDATE tbl_users SET password = ? WHERE email = ?
    `;
    await executeQuery(updatePasswordQuery, [hashedPassword, email]);

    const deleteOtpQuery = `DELETE FROM tbl_otp WHERE email = ?`;
    await executeQuery(deleteOtpQuery, [email]);

    sendResponse(res, 200, true, "Password successfully reset.");
  } catch (error) {
    handleResponseError(res, error);
  }
};

const getMe = async (req, res) => {
  if (!req.user || !req.user.id) {
    return sendResponse(res, 203, false, "Unauthorized access.");
  }

  const userId = req.user.id;

  try {
    const sql = "SELECT * FROM tbl_users WHERE id = ?";
    const data = await executeQuery(sql, [userId]);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "User not found.");
    }

    sendResponse(res, 200, true, "Get user profile.", data[0]); // Send single user object
  } catch (error) {
    console.error(error);
    handleResponseError(res, error);
  }
};

const logout = (req, res) => {
  res.cookie("jwtToken", "", { maxAge: 1 });
  sendResponse(res, 200, true, "Logout successfully");
};

module.exports = {
  postSignUp,
  postSignIn,
  postForgotPassword,
  verifyOtp,
  postResetPassword,
  getMe,
  logout,
};
