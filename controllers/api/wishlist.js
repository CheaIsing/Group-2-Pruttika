const { handleResponseError } = require("../../utils/handleError");
const { executeQuery } = require("../../utils/dbQuery");
const { sendResponse } = require("../../utils/response");

const getAllWishlist = async (req, res) => {
  try {
    const query = `
      SELECT w.id, w.user_id, w.event_id, e.eng_name, e.started_date, e.ended_date, u.eng_name
      FROM tbl_wishlist AS w
      JOIN tbl_event AS e ON w.event_id = e.id
      JOIN tbl_users AS u ON w.user_id = u.id
    `;

    const data = await executeQuery(query);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No event in wishlist found.");
    }

    sendResponse(res, 200, true, "Display all events in wishlist.", data);
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const getWishlistById = async (req, res) => {
  const id = req.params.id;

  try {
    const query = `
      SELECT w.id, w.user_id, w.event_id, e.eng_name, e.started_date, e.ended_date, u.eng_name
      FROM tbl_wishlist AS w
      JOIN tbl_event AS e ON w.event_id = e.id
      JOIN tbl_users AS u ON w.user_id = u.id
      WHERE w.id = ?
    `;

    const data = await executeQuery(query, [id]);

    if (data.length === 0) {
      return sendResponse(
        res,
        404,
        false,
        `No event in wishlist with id : ${id} found.`
      );
    }

    sendResponse(res, 200, true, `Display event in wishlist id : ${id}`, data);
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const storeEventToWishlist = async (req, res) => {
  const userId = req.user.id;
  const { event_id } = req.body;

  try {
    const checkEventQuery = "SELECT id FROM tbl_event WHERE id = ?";
    const checkUserQuery = "SELECT id FROM tbl_users WHERE id = ?";

    const eventData = await executeQuery(checkEventQuery, [event_id]);
    const userData = await executeQuery(checkUserQuery, [userId]);

    if (eventData.length === 0) {
      return sendResponse(res, 404, false, "Event not found.");
    }

    if (userData.length === 0) {
      return sendResponse(res, 404, false, "User not found.");
    }

    const query = "INSERT INTO tbl_wishlist (user_id, event_id) VALUES (?, ?)";
    await executeQuery(query, [userId, event_id]);

    sendResponse(res, 200, true, "Stored event to wishlist successfully.");
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const deleteItemInWishlist = async (req, res) => {
  const id = req.params.id;

  try {
    const query = "SELECT * FROM tbl_wishlist WHERE id = ?";
    const data = await executeQuery(query, [id]);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No item in wishlist.");
    }

    const deleteQuery = "DELETE FROM tbl_wishlist WHERE id = ?";
    await executeQuery(deleteQuery, [id]);

    sendResponse(res, 200, true, "Deleted item from wishlist successfully.");
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

module.exports = {
  getAllWishlist,
  getWishlistById,
  storeEventToWishlist,
  deleteItemInWishlist,
};
