const express = require("express");

const { displayAllUsers } = require("../../../controllers/web/admin/user");

const router = express.Router();

router.get("/display", displayAllUsers);

module.exports = router;
