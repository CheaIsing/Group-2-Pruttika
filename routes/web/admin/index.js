const express = require("express");

const { getAdminDashboard } = require("../../../controllers/web/admin/index");
const { authorize } = require("../../../middlewares/web.middleware");

const { requireAuth, checkRole } = require("../../../middlewares/auth")

const router = express.Router();

router.use(authorize([ 3]))

router.get("/", getAdminDashboard);
router.get("/", requireAuth, checkRole(3), getAdminDashboard);

module.exports = router;
