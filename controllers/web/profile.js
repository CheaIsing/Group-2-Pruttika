const getProfileInfo = (req, res) => {
  res.render("pages/profile/profileInfo");
};

const getChangePassword = (req, res) => {
  res.render("pages/profile/changePassword");
};

const getDeleteAccount = (req, res) => {
  res.render("pages/profile/deleteAccount");
};

const getManageAccount = (req, res) => {
  res.render("pages/profile/accountmanagement");
};

const getOrganizer = (req, res) => {
  res.render("pages/profile/organizer");
};

module.exports = {
  getProfileInfo,
  getChangePassword,
  getDeleteAccount,
  getOrganizer,
  getManageAccount
};
