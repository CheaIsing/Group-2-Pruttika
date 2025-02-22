const express = require("express");
const { getCreateEvent, getUpdateEvent, getEventDetail, getBrowseEvent, getWishlist } = require("../../controllers/web/event");
const {checkOrganizer}=require('../../middlewares/event');
const {requireAuth} = require('../../middlewares/auth');


const router = express.Router();

router.get("/create", getCreateEvent);
router.get("/update-event", getUpdateEvent);
router.get("/detail", getEventDetail);
router.get("/browse", getBrowseEvent);
router.get("/wishlist", getWishlist);

module.exports = router;
