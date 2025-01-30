const express = require("express");

const {
  viewEvent,
  searchEvent,
  filterEvent,
  viewEventDetail,
  viewAllEventCategory,
  viewEventCategoryById,
  createEventCategory,
  updateEventCategory,
  deleteEventCategory
} = require("../../../controllers/api/admin/event");

const router = express.Router();

router.get("/view", viewEvent);
router.get("/search", searchEvent);
router.get("/filter", filterEvent);
router.get("/detail/:id", viewEventDetail);

router.get("/category/view", viewAllEventCategory);
router.get("/category/view/:id", viewEventCategoryById);

router.post("/category/create", createEventCategory);
router.put("/category/update/:id", updateEventCategory);
router.delete("/category/delete/:id", deleteEventCategory);

module.exports = router;
