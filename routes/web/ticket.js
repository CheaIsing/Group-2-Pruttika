const express = require("express");
const { getRequestTickets } = require("../../controllers/web/ticket");

const router = express.Router();

router.get("/my-ticket", getRequestTickets);

module.exports = router;