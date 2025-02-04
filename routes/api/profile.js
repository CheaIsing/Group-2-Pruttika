const express = require("express");

const {
    getAllProfile,
    getProfileById,
    updateOwnInfo,
    updateOwnPassword,
    updateOwnProfileImage,
    deleteOwnProfileImage,
    deleteOwnAccount
} = require("../../controllers/api/profile");
const { requireAuth, checkRole } = require("../../middlewares/auth");

const router = express.Router();

router.get("/display", requireAuth, checkRole(3), getAllProfile);
router.get("/display/:id", requireAuth, checkRole(3), getProfileById);

router.put("/info", requireAuth, updateOwnInfo);
router.put("/pass", requireAuth, updateOwnPassword);

router.post("/avatar", requireAuth, updateOwnProfileImage);
router.post("/delete-acc", requireAuth, deleteOwnAccount);

router.delete("/avatar", requireAuth, deleteOwnProfileImage);

module.exports = router;
