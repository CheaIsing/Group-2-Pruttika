const express = require("express");
const { getLanding, getHomepage } = require("../../controllers/web");
const { requireAuth } = require("../../middlewares/auth");
const { preventFromAuthorize, authorize } = require("../../middlewares/web.middleware");

const router = express.Router();

router.get("/", preventFromAuthorize, getLanding);

router.get("/homepage", authorize([1, 2, 3]), getHomepage);

module.exports = router;