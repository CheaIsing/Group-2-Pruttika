const getSignUp = (req, res) => {
  res.render("auth/signup");
};

const getSignIn = (req, res) => {
  res.render("auth/signin");
};

const getForgotPassword = (req, res) => {
  res.render("auth/forgot-password");
};

const getVerifyOtp = (req, res) => {
  res.render("auth/verify-otp");
}

const getResetPassword = (req, res) => {
  const { email } = req.params;

  res.render("auth/reset-password", { token, email });
};


module.exports = {
  getSignUp,
  getSignIn,
  getForgotPassword,
  getVerifyOtp,
  getResetPassword,
};
