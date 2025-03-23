const express = require("express");
const {
  getCreateEvent,
  getEventList,
  getUpdateEvent,
  getEventDetail,
  getBrowseEvent,
  getWishlist,
  getRequestEventList,
  getRequestTicketList,
  getCheckInTicketList,
  getRequestTransaction,
  getCheckInEventList,
  getSummaryData,
  getEventManageDetail,
} = require("../../controllers/web/event");
const { checkOrganizer } = require("../../middlewares/event");
const { requireAuth } = require("../../middlewares/auth");
const { authorize } = require("../../middlewares/web.middleware");

const router = express.Router();

router.get("/browse", getBrowseEvent);
router.get("/detail", getEventDetail);
router.get("/wishlist", getWishlist);

router.use(authorize([2, 3]));
router.get("/create", getCreateEvent);
router.get("/update-event", getUpdateEvent);
router.get("/manage", getEventList);
router.get("/manage/detail", getEventManageDetail);
router.get("/manage-request", getRequestEventList);
router.get("/manage-check-in", getCheckInEventList);
router.get("/request-ticket-list", getRequestTicketList);
router.get("/request-transaction", getRequestTransaction);
router.get("/check-in-ticket-list", getCheckInTicketList);
router.get("/summary", getSummaryData);

module.exports = router;
