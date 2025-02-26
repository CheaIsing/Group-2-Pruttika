const express = require("express");

const {
    accountSetting,
} = require("../../../controllers/web/admin/setting");
const { authorize } = require("../../../middlewares/web.middleware");

const router = express.Router();

router.use(authorize([3]))

router.get("/display", accountSetting);

module.exports = router;
