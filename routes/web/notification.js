const express = require("express");
const { getNotification } = require("../../controllers/web/notification");
const { authorize } = require("../../middlewares/web.middleware");


const router = express.Router();
router.use(authorize([1, 2, 3]))
router.get("/", getNotification);

module.exports = router;