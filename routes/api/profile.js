const express = require("express");

const {
    updateOwnInfo,
    updateOwnPassword,
    updateOwnProfileImage,
    deleteOwnProfileImage,
    deleteOwnAccount,
    deactivateAccount
} = require("../../controllers/api/profile");
const { requireAuth } = require("../../middlewares/auth");

const router = express.Router();

router.put("/info", requireAuth, updateOwnInfo);
router.put("/pass", requireAuth, updateOwnPassword);
router.put("/deactivate", requireAuth, deactivateAccount);

router.post("/avatar", requireAuth, updateOwnProfileImage);
router.post("/delete-acc", requireAuth, deleteOwnAccount);

router.delete("/avatar", requireAuth, deleteOwnProfileImage);



module.exports = router;
