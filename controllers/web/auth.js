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
  res.render("pages/auth/forgot-password", {
    title: req.t("auth.forgot-password.heading"),
    language: req.language,
    req,
    t: req.t,
  });
};

const getVerifyOtp = (req, res) => {
  res.render("pages/auth/verify-otp", {
    title: req.t("auth.verify-otp.heading"),
    language: req.language,
    req,
    t: req.t,
  });
};

const getResetPassword = (req, res) => {
  res.render("pages/auth/reset-password", {
    title: req.t("auth.reset-password.heading"),
    language: req.language,
    req,
    t: req.t,
  });
};

module.exports = {
  getSignUp,
  getSignIn,
  getForgotPassword,
  getVerifyOtp,
  getResetPassword,
};
