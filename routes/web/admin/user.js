const express = require("express");

const { displayAllUsers } = require("../../../controllers/web/admin/user");
const { authorize } = require("../../../middlewares/web.middleware");

const router = express.Router();
router.use(authorize([3]))
router.get("/display", displayAllUsers);

module.exports = router;
