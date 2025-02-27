const express = require("express");
const { getMyTickets, getBuyTickets } = require("../../controllers/web/ticket");
const { authorize } = require("../../middlewares/web.middleware");

const router = express.Router();
router.use(authorize([1, 2, 3]))

router.get("/my-ticket", getMyTickets);
router.get("/buy-ticket", getBuyTickets);

module.exports = router;