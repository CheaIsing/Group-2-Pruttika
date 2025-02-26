const express = require("express");

const {
    chnageOwnInfo,
    changePassword,
    chnageAvatar,
    logout
} = require("../../../controllers/api/admin/setting");

const { requireAuth, checkRole } = require("../../../middlewares/auth");

const router = express.Router();

router.put("/info", requireAuth, checkRole(3), chnageOwnInfo);
router.put("/pass", requireAuth, checkRole(3), changePassword);
router.post("/avatar", requireAuth, checkRole(3), chnageAvatar);
router.delete("/logout", requireAuth, checkRole(3), logout);

module.exports = router;