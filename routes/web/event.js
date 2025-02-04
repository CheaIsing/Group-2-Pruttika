const express = require("express");
const { getCreateEvent } = require("../../controllers/web/event");
const {checkOrganizer}=require('../../middlewares/event');
const {requireAuth} = require('../../middlewares/auth');


const router = express.Router();

router.get("/create-event",requireAuth,checkOrganizer, getCreateEvent);

module.exports = router;
