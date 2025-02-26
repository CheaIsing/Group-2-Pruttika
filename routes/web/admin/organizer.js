const express = require("express");

const {
  displayAllOrganizer,
} = require("../../../controllers/web/admin/organizer");

const router = express.Router();

router.get("/display", displayAllOrganizer);

module.exports = router;
