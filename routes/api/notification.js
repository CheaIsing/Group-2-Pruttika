const express = require("express");
const {
  getNotifications,
  getNotification,
  readNotifications,
  readNotification,
  unreadNotification,
  deleteNotification,
} = require("../../controllers/api/notification");
const { requireAuth } = require("../../middlewares/auth");

const router = express.Router();

router.get("/", requireAuth, getNotifications);

router.get("/:id", requireAuth, getNotification);

router.put("/read", requireAuth, readNotifications);

router.put("/read/:id", requireAuth, readNotification);

router.put("/unread/:id", requireAuth, unreadNotification);

router.delete("/:id", requireAuth, deleteNotification);

module.exports = router;
