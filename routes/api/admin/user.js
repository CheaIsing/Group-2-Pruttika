const express = require("express");

const {
    filterByRole,
    searchUser,
    sortByRegisterDate,
    editUser,
    getUserDetails,
    deactivateUser
} = require("../../../controllers/api/admin/user");

const router = express.Router();

router.get('/filterbyrole/:id', filterByRole);
router.get('/search', searchUser);
router.get('/sortbydate', sortByRegisterDate);
router.get('/userDetail/:id', getUserDetails);

router.put("/editUser/:id", editUser);

module.exports = router;