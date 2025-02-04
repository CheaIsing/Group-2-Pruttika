const express = require("express");

const {
  displayPendingOrganizer,
  displayAllOrganizer,
  filterOrganizer,
  adminApproval,
  adminRejection,
} = require("../../../controllers/api/admin/organizer");

const { requireAuth, checkRole } = require("../../../middlewares/auth");

const router = express.Router();

router.get("/pending", requireAuth, checkRole(3), displayPendingOrganizer);
router.get("/display", requireAuth, checkRole(3), displayAllOrganizer);
router.get("/filter/:status", requireAuth, checkRole(3), filterOrganizer);
router.put("/approve/:id", requireAuth, checkRole(3), adminApproval);
router.put("/reject/:id", requireAuth, checkRole(3), adminRejection);

module.exports = router;
