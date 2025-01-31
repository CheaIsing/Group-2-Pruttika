const { handleResponseError } = require("../../utils/handleError");
const { executeQuery } = require("../../utils/dbQuery");
const { sendResponse } = require("../../utils/response");

const getAllWishlist = async (req, res) => {
  try {
    const query = "SELECT * FROM tbl_wishlist";

    const data = await executeQuery(query);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No event in wishlist found.");
    }

    sendResponse(res, 200, true, "Display all event in wishlist.", data);
  } catch (error) {
    console.log(error);
    handleResponseError(error);
  }
};

const getWishlistById = async (req, res) => {
  const id = req.params.id;

  try {
    const query = "SELECT * FROM tbl_wishlist WHERE id = ?";

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
  const { user_id, event_id } = req.body;

  try {
    const query = "INSERT INTO tbl_wishlist (user_id, event_id) VALUES (?, ?)";

    await executeQuery(query, [user_id, event_id]);

    sendResponse(res, 200, true, "Stored event to wishlist sucessfully.");
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

    sendResponse(res, 200, true, "Delete item from wishlist successfully.");
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

module.exports = {
  getAllWishlist,
  getWishlistById,
  storeEventToWishlist,
  deleteItemInWishlist
};
