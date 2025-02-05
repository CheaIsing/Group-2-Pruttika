const getSignUp = (req, res) => {
  res.render("pages/auth/signup", {title: "Sign Up"});
};

const getSignIn = (req, res) => {
  res.render("pages/auth/signin", {title: "Sign In"});
};

const getForgotPassword = (req, res) => {
  res.render("pages/auth/forgot-password",  {title: "Forgot Password"});
};

const getVerifyOtp = (req, res) => {
  res.render("pages/auth/verify-otp", {title: "Verify OTP"});
}

const getResetPassword = (req, res) => {


  res.render("pages/auth/reset-password", {title: "Reset Password"});
};


module.exports = {
  getSignUp,
  getSignIn,
  getForgotPassword,
  getVerifyOtp,
  getResetPassword,
};
