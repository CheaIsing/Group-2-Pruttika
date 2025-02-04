const express = require("express");
const { promoteToOrganizer } = require("../../controllers/api/organizer");
const { requireAuth, checkRole } = require("../../middlewares/auth");

const router = express.Router();

router.post("/promote", requireAuth, checkRole(1), promoteToOrganizer);

module.exports = router;
