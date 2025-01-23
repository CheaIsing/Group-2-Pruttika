const getSignUp = (req, res) => {
  res.render("pages/auth/signup");
};

const getSignIn = (req, res) => {
  res.render("pages/auth/signin");
};

const getForgotPassword = (req, res) => {
  res.render("pages/auth/forgot-password");
};

const getVerifyOtp = (req, res) => {
  res.render("pages/auth/verify-otp");
}

const getResetPassword = (req, res) => {
  const { email } = req.params;

  res.render("pages/auth/reset-password", { token, email });
};


module.exports = {
  getSignUp,
  getSignIn,
  getForgotPassword,
  getVerifyOtp,
  getResetPassword,
};
