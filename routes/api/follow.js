const express = require("express");

const {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
} = require("../../controllers/api/follow");

const {
    requireAuth
} = require("../../middlewares/auth");

const router = express.Router();

router.post("/:id", requireAuth, followUser);
router.delete("/unfollow/:id", requireAuth, unfollowUser);

router.get("/followers/:id", getFollowers);
router.get("/following/:id", getFollowing);

module.exports = router;