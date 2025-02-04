const express = require("express");

const {
  getAllWishlist,
  getWishlistById,
  storeEventToWishlist,
  deleteItemInWishlist,
} = require("../../controllers/api/wishlist");

const { requireAuth } = require("../../middlewares/auth"); 

const router = express.Router();

router.get("/display", getAllWishlist);
router.get("/display/:id", getWishlistById);

router.post("/create", requireAuth, storeEventToWishlist);

router.delete("/delete/:id", deleteItemInWishlist);

module.exports = router;
