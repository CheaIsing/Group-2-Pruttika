const express = require("express");

const { displayProfile } = require("../../../controllers/web/admin/profile");

const router = express.Router();

router.get("/display", displayProfile);

module.exports = router;
