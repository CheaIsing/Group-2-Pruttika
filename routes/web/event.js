const express = require("express");
const { getCreateEvent, getEventList, getUpdateEvent, getEventDetail, getBrowseEvent, getWishlist, getRequestEventList, getRequestTicketList,getCheckInTicketList, getRequestTransaction, getCheckInEventList } = require("../../controllers/web/event");
const {checkOrganizer}=require('../../middlewares/event');
const {requireAuth} = require('../../middlewares/auth');


const router = express.Router();

router.get("/create", getCreateEvent);
router.get("/update-event", getUpdateEvent);
router.get("/detail", getEventDetail);
router.get("/browse", getBrowseEvent);
router.get("/wishlist", getWishlist);
router.get("/manage", getEventList);
router.get("/manage-request", getRequestEventList);
router.get("/manage-check-in", getCheckInEventList);
router.get("/request-ticket-list", getRequestTicketList);
router.get("/request-transaction", getRequestTransaction);
router.get("/check-in-ticket-list", getCheckInTicketList);

module.exports = router;
