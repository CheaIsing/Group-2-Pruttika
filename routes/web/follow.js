const express = require("express");
const { getFollowers, getFollowing } = require("../../controllers/web/follow");
const { authorize } = require("../../middlewares/web.middleware");


const router = express.Router();

router.use(authorize([1, 2, 3]))

router.get("/follower", getFollowers);

router.get("/following", getFollowing);

module.exports = router;
