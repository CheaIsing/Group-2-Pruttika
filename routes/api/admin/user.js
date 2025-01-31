const express = require("express");

const {
    filterByRole,
    searchUser,
    sortByRegisterDate,
    editUser,
    getUserDetails,
    deactivateUser
} = require("../../../controllers/api/admin/user");
const { checkRole } = require("../../../middlewares/checkRole");

const router = express.Router();

router.get('/filterbyrole/:id', checkRole(["admin"]), filterByRole);
router.get('/search', searchUser);
router.get('/sortbydate', sortByRegisterDate);
router.get('/userDetail/:id', getUserDetails);

router.put("/editUser/:id", editUser);
router.put("/deactivate/:id", deactivateUser);

module.exports = router;