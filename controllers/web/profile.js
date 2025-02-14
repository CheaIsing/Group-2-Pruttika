const getProfileInfo = (req, res) => {
  res.render("pages/profile/profileInfo", {title: "Profile Information"});
};

const getChangePassword = (req, res) => {
  res.render("pages/profile/changePassword",{title: "Change Password"});
};

const getDeleteAccount = (req, res) => {
  res.render("pages/profile/deleteAccount", {title: "Delete Account"});
};

const getManageAccount = (req, res) => {
  res.render("pages/profile/accountmanagement", {title: "Manage Account"});
};

const getOrganizer = (req, res) => {
  res.render("pages/profile/organizer", {title: "Organizer Setting"});
};

module.exports = {
  getProfileInfo,
  getChangePassword,
  getDeleteAccount,
  getOrganizer,
  getManageAccount
};
