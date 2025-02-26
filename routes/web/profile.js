const express = require("express");
const {
  getProfileInfo,
  getChangePassword,
  getDeleteAccount,
  getOrganizer,
  getManageAccount,
  getViewOrganizerProfile
} = require("../../controllers/web/profile");
const { authorize } = require("../../middlewares/web.middleware");

const router = express.Router();

// router.get("/", getRedirect);

router.use(authorize([2, 3]))

router.get("/info", getProfileInfo);

router.get("/manage-account", getManageAccount);

router.get("/change-password", getChangePassword);

router.get("/organizer", getOrganizer);

// router.get("/privacy", getChangePassword);

router.get("/delete-account", getDeleteAccount);

router.get("/view-profile", getViewOrganizerProfile);

module.exports = router;
