const express = require("express");
const {
  getProfileInfo,
  getChangePassword,
  getDeleteAccount,
  getOrganizer,
  getManageAccount
} = require("../../controllers/web/profile");

const router = express.Router();

// router.get("/", getRedirect);

router.get("/info", getProfileInfo);

router.get("/manage-account", getManageAccount);

router.get("/change-password", getChangePassword);

router.get("/organizer", getOrganizer);

// router.get("/privacy", getChangePassword);

router.get("/delete-account", getDeleteAccount);

module.exports = router;
