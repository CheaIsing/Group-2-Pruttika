const express = require("express");

const {
    accountSetting,
} = require("../../../controllers/web/admin/setting");

const router = express.Router();

router.get("/display", accountSetting);

module.exports = router;
