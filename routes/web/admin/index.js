const express = require("express");

const { getAdminDashboard } = require("../../../controllers/web/admin/index");

const { requireAuth, checkRole } = require("../../../middlewares/auth")

const router = express.Router();

router.get("/", requireAuth, checkRole(3), getAdminDashboard);

module.exports = router;
