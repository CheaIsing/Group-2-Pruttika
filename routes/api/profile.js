const express = require("express");

const {
    getAllProfile,
    getProfileById,
    updateOwnInfo,
    updateOwnPassword,
    updateOwnProfileImage,
    deleteOwnProfileImage,
    deleteOwnAccount,
    getOwnReqTicket,
    getOwnTicket
} = require("../../controllers/api/profile");
const { requireAuth, checkRole } = require("../../middlewares/auth");

const router = express.Router();

router.get("/display", requireAuth, checkRole(3), getAllProfile);
router.get("/display/:id", requireAuth, checkRole(3), getProfileById);
router.get('/own-request-ticket',requireAuth,getOwnReqTicket);
router.get('/own-ticket',requireAuth,getOwnTicket);

router.put("/info", requireAuth, updateOwnInfo);
router.put("/pass", requireAuth, updateOwnPassword);

router.post("/avatar", requireAuth, updateOwnProfileImage);
router.post("/delete-acc", requireAuth, deleteOwnAccount);

router.delete("/avatar", requireAuth, deleteOwnProfileImage);

module.exports = router;
