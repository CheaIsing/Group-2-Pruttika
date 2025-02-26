const express = require("express");
const { getFollowers, getFollowing } = require("../../controllers/web/follow");


const router = express.Router();


router.get("/follower", getFollowers);

router.get("/following", getFollowing);

module.exports = router;
