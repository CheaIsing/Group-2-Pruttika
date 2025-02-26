const express = require("express");

const { displayAllOrganizer } = require("../../../controllers/web/admin/organizer");
const { authorize } = require("../../../middlewares/web.middleware");

const router = express.Router();

router.use(authorize([3]))

router.get("/display", displayAllOrganizer);

module.exports = router;
