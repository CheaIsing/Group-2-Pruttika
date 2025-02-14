const express = require("express");
const { getCreateEvent, getUpdateEvent } = require("../../controllers/web/event");
const {checkOrganizer}=require('../../middlewares/event');
const {requireAuth} = require('../../middlewares/auth');


const router = express.Router();

router.get("/create-event", getCreateEvent);
router.get("/update-event", getUpdateEvent);

module.exports = router;
