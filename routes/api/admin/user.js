const express = require("express");

const {
    displayAllUsers,
    editUser,
    getUserDetails,
    removeUser
} = require("../../../controllers/api/admin/user");

const { requireAuth, checkRole } = require("../../../middlewares/auth");

const router = express.Router();

router.get('/display', requireAuth, checkRole(3), displayAllUsers);
router.get('/userDetail/:id', requireAuth, checkRole(3), getUserDetails);

router.put("/editUser/:id", requireAuth, checkRole(3), editUser);

router.delete("/remove/:id", requireAuth, checkRole(3), removeUser);

module.exports = router;