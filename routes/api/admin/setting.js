const express = require("express");

const {
    changeEmail,
    changePassword,
    logout
} = require("../../../controllers/api/admin/setting");

const { requireAuth, checkRole } = require("../../../middlewares/auth");

const router = express.Router();

router.put("/email", requireAuth, checkRole(3), changeEmail);
router.put("/pass", requireAuth, checkRole(3), changePassword);
router.delete("/logout", requireAuth, checkRole(3), logout);

module.exports = router;