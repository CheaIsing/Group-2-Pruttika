const express = require("express");

const {
  getSignUp,
  getSignIn,
  getForgotPassword,
  getVerifyOtp,
  getResetPassword
} = require("../../controllers/web/auth");
const { preventFromAuthorize } = require("../../middlewares/web.middleware");

const router = express.Router();

router.use(preventFromAuthorize)

router.get("/signup", getSignUp);
router.get("/signin", getSignIn);
router.get("/forgot-password", getForgotPassword);
router.get("/verify-otp", getVerifyOtp);
router.get("/reset-password", getResetPassword);

module.exports = router;
