const express = require("express");
const { promoteToOrganizer, displayRequestOrganizerById } = require("../../controllers/api/organizer");
const { requireAuth, checkRole } = require("../../middlewares/auth");

const router = express.Router();

router.post("/promote", requireAuth, checkRole(1), promoteToOrganizer);

router.get("/detail", requireAuth, checkRole(1, 2, 3), displayRequestOrganizerById);

module.exports = router;
