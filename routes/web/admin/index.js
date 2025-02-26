const express = require("express");

const { getAdminDashboard } = require("../../../controllers/web/admin/index");
const { authorize } = require("../../../middlewares/web.middleware");

const router = express.Router();

router.use(authorize([ 3]))

router.get("/", getAdminDashboard);

module.exports = router;
