const express = require("express");
const { getErrorPage, getPolicy, getTerms, getFaq, getContact, getAbout } = require("../../controllers/web/static");

const router = express.Router();

router.get("/policy", getPolicy)
router.get("/term-of-service", getTerms)
router.get("/faq", getFaq)
router.get("/contact", getContact)
router.get("/about", getAbout)



module.exports = router;