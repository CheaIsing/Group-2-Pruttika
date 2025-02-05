const express = require("express");

const {
    displayAllUsers,
    editUser,
    getUserDetails,
    deactivateUser
} = require("../../../controllers/api/admin/user");

const { requireAuth, checkRole } = require("../../../middlewares/auth");

const router = express.Router();

router.get('/display', requireAuth, checkRole(3), displayAllUsers);
router.get('/userDetail/:id', requireAuth, checkRole(3), getUserDetails);

router.put("/editUser/:id", requireAuth, checkRole(3), editUser);
router.put("/deactivate/:id", requireAuth, checkRole(3), deactivateUser);

module.exports = router;