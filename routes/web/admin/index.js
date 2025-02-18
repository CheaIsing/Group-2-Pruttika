const express = require("express");

const { getAdminDashboard } = require("../../../controllers/web/admin/index");

const router = express.Router();

router.get("/", getAdminDashboard);

module.exports = router;
