const express = require("express");
const { getLanding, getHomepage } = require("../../controllers/web");
const { requireAuth } = require("../../middlewares/auth");


const router = express.Router();

router.get("/", requireAuth, getLanding);

router.get("/homepage", getHomepage);

module.exports = router;