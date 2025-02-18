const express = require("express");

const {
  displayRequestOrganizer,
  displayAllOrganizer,
  getOrganizerDetails,
  editOrganizer,
  removeOrganizer,
  adminApproval,
  adminRejection,
} = require("../../../controllers/api/admin/organizer");

const { requireAuth, checkRole } = require("../../../middlewares/auth");

const router = express.Router();

router.get("/request", requireAuth, checkRole(3), displayRequestOrganizer);
router.get("/all", requireAuth, checkRole(3), displayAllOrganizer);
router.get("/details/:id", requireAuth, checkRole(3), getOrganizerDetails);

router.put("/update/:id", requireAuth, checkRole(3), editOrganizer);
router.put("/approve/:id", requireAuth, checkRole(3), adminApproval);
router.put("/reject/:id", requireAuth, checkRole(3), adminRejection);

router.delete("/remove/:id", requireAuth, checkRole(3), removeOrganizer);

module.exports = router;
