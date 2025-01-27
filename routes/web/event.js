const express = require("express");
const { getCreateEvent } = require("../../controllers/web/event");

const router = express.Router();

router.get("/create-event", getCreateEvent);

module.exports = router;
