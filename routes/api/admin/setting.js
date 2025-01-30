const express = require("express");

const {
    changeEmail,
    changePassword
} = require("../../../controllers/api/admin/setting");

const { requireAuth } = require("../../../middlewares/auth");

const router = express.Router();

router.put("/email", requireAuth, changeEmail);
router.put("/pass", requireAuth, changePassword);

module.exports = router;