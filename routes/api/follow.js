const express = require("express");

const {
    followUser,
    unfollowUser,
    removeFollower,
    getFollowers,
    getFollowing
} = require("../../controllers/api/follow");

const {
    requireAuth
} = require("../../middlewares/auth");

const router = express.Router();

router.post("/:id", requireAuth, followUser);
router.delete("/unfollow/:id", requireAuth, unfollowUser);
router.delete("/remove-follower/:id", requireAuth, removeFollower);

router.get("/followers/:id", requireAuth,  getFollowers);
router.get("/following/:id", requireAuth, getFollowing);

module.exports = router;