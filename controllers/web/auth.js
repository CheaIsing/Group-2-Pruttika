const getSignUp = (req, res) => {
  res.render("pages/auth/signup", {
    title: req.t("auth.signup.heading"),
    language: req.language,
    req,
    t: req.t,
  });
};

const getSignIn = (req, res) => {
  res.render("pages/auth/signin", {
    title: req.t("auth.signin.heading"),
    language: req.language,
    req,
    t: req.t,
  });
};

const getForgotPassword = (req, res) => {
  res.render("pages/auth/forgot-password", { title: "Forgot Password" });
};

const getVerifyOtp = (req, res) => {
  res.render("pages/auth/verify-otp", { title: "Verify OTP" });
};

const getResetPassword = (req, res) => {
  res.render("pages/auth/reset-password", { title: "Reset Password" });
};

module.exports = {
  getSignUp,
  getSignIn,
  getForgotPassword,
  getVerifyOtp,
  getResetPassword,
};
