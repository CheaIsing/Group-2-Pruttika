const express = require("express");

const {
    changeEmail,
    changePassword
} = require("../../../controllers/api/admin/setting");

const { requireAuth, checkRole } = require("../../../middlewares/auth");

const router = express.Router();

router.put("/email", requireAuth, checkRole(3), changeEmail);
router.put("/pass", requireAuth, checkRole(3), changePassword);

module.exports = router;