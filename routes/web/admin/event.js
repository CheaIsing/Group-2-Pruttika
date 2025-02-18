const express = require("express");

const {
  displayAllEvent,
} = require("../../../controllers/web/admin/event");

const router = express.Router();

router.get("/display", displayAllEvent);

module.exports = router;
