const express = require("express");

const {
  displayRequestOrganizer,
  displayAllOrganizer,
  adminApproval,
  adminRejection,
} = require("../../../controllers/api/admin/organizer");

const { requireAuth, checkRole } = require("../../../middlewares/auth");

const router = express.Router();

router.get("/request", requireAuth, checkRole(3), displayRequestOrganizer);
router.get("/display", requireAuth, checkRole(3), displayAllOrganizer);
router.put("/approve/:id", requireAuth, checkRole(3), adminApproval);
router.put("/reject/:id", requireAuth, checkRole(3), adminRejection);

module.exports = router;
