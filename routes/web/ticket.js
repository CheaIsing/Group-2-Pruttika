const express = require("express");
const { getMyTickets, getBuyTickets } = require("../../controllers/web/ticket");

const router = express.Router();

router.get("/my-ticket", getMyTickets);
router.get("/buy-ticket", getBuyTickets);

module.exports = router;