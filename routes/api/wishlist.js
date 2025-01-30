const express = require("express");

const {
  getAllWishlist,
  getWishlistById,
  storeEventToWishlist,
  deleteItemInWishlist,
} = require("../../controllers/api/wishlist");

const router = express.Router();

router.get("/display", getAllWishlist);
router.get("/display/:id", getWishlistById);

router.post("/create", storeEventToWishlist);

router.delete("/delete/:id", deleteItemInWishlist);

module.exports = router;
