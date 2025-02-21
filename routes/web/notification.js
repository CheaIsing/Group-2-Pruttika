const express = require("express");
const { getNotification } = require("../../controllers/web/notification");


const router = express.Router();

router.get("/", getNotification);

module.exports = router;