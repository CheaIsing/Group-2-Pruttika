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

const { requireAuth, checkRole } = require("../../../middlewares/auth");

const router = express.Router();

router.get("/view", requireAuth, checkRole(3), viewEvent);
router.get("/search", requireAuth, checkRole(3), searchEvent);
router.get("/filter", requireAuth, checkRole(3), filterEvent);
router.get("/detail/:id", requireAuth, checkRole(3), viewEventDetail);

router.get("/category/view", requireAuth, checkRole(3), viewAllEventCategory);
router.get("/category/view/:id", requireAuth, checkRole(3), viewEventCategoryById);

router.post("/category/create", requireAuth, checkRole(3), createEventCategory);
router.put("/category/update/:id", requireAuth, checkRole(3), updateEventCategory);
router.delete("/category/delete/:id", requireAuth, checkRole(3), deleteEventCategory);

module.exports = router;
