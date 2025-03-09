const getProfileInfo = (req, res) => {
  res.render("pages/profile/profileInfo", {title: "Profile Information", active: "info"});
};

const getChangePassword = (req, res) => {
  res.render("pages/profile/changePassword",{title: "Change Password", active: "account"});
};

const getDeleteAccount = (req, res) => {
  res.render("pages/profile/deleteAccount", {title: "Delete Account", active: "account"});
};

const getManageAccount = (req, res) => {
  res.render("pages/profile/accountmanagement", {title: "Manage Account", active: "account"});
};

const getOrganizer = (req, res) => {
  res.render("pages/profile/organizer", {title: "Organizer Setting", active: "organizer"});
};

const getViewOrganizerProfile = (req, res) => {
  res.render("pages/profile/organizerProfile", {title: "View Profile"});
};


const getOrganizerView = (req, res) => {
  res.render("pages/profile/organizerView", {title: "Organizer View" , active: "organizer"});
};

const getChangeLanguage = (req, res) => {
  res.render("pages/profile/change-language", {title: "Change Language", active: "language"});
};
const getPolicy = (req, res) => {
  res.render("pages/profile/profile-policy", {title: "Privacy Policy", active: "privacy"});
};
const getTermOfService = (req, res) => {
  res.render("pages/profile/profile-termOfservice", {title: "Term Of Service", active: "terms"});
};



module.exports = {
  getProfileInfo,
  getChangePassword,
  getDeleteAccount,
  getOrganizer,
  getViewOrganizerProfile,
  getManageAccount,
  getOrganizerView,
  getChangeLanguage,
  getTermOfService,
  getPolicy
};
