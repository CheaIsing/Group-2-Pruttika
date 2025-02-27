const express = require("express");

const {
  displayAllEvent,
} = require("../../../controllers/web/admin/event");
const { authorize } = require("../../../middlewares/web.middleware");

const router = express.Router();

router.use(authorize([3]))

router.get("/display", displayAllEvent);

module.exports = router;
