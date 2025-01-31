const express = require("express");

const {
    filterByRole,
    searchUser,
    sortByRegisterDate,
    editUser,
    getUserDetails,
    deactivateUser
} = require("../../../controllers/api/admin/user");
const { checkRole, requireAuth } = require("../../../middlewares/checkRole");

const router = express.Router();

router.get('/filterbyrole/:id', requireAuth, checkRole(3), filterByRole);
router.get('/search', requireAuth, checkRole(3), searchUser);
router.get('/sortbydate', requireAuth, checkRole(3), sortByRegisterDate);
router.get('/userDetail/:id', requireAuth, checkRole(3), getUserDetails);

router.put("/editUser/:id", requireAuth, checkRole(3), editUser);
router.put("/deactivate/:id", requireAuth, checkRole(3), deactivateUser);

module.exports = router;