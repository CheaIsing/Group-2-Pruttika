const { executeQuery } = require("../../../utils/dbQuery");
const { handleResponseError } = require("../../../utils/handleError");
const { sendResponse } = require("../../../utils/response");

const viewEvent = async (req, res) => {
  try {
    const query = "SELECT * FROM tbl_event";

    const data = await executeQuery(query);

    sendResponse(res, 200, true, "Display all events.", data);
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const searchEvent = async (req, res) => {
  const { name } = req.query;

  try {
    if (!name) {
      return sendResponse(
        res,
        400,
        false,
        "At least one of name query parameters is required."
      );
    }

    const query = "SELECT * FROM tbl_event WHERE eng_name LIKE ?";

    const data = await executeQuery(query, [`%${name}%`]);

    sendResponse(res, 200, true, "Search Result ", data);
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const filterEvent = async (req, res) => {
  const { category_id } = req.query;

  try {
    if (!category_id) {
      return sendResponse(res, 400, false, "Category ID is required");
    }

    const query = `
      SELECT e.end_name, e.short_description, e.thumbnail, e.started_date, e.ended_date, e.location, e.event_type, e.is_published, c.name FROM tbl_event as e LEFT JOIN tbl_event_category as ec ON e.id = ec.event_id LEFT JOIN tbl_category as c ON ec.category_id = c.id WHERE c.id= ?
    `;

    const data = await executeQuery(query, [category_id]);

    sendResponse(res, 200, true, "Filtered events by category", data);
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const viewEventDetail = async (req, res) => {
  const id = req.params.id;

  try {
    const query = "SELECT * FROM tbl_event WHERE id = ?";

    const data = await executeQuery(query, [id]);

    sendResponse(res, 200, true, "Display event detail", data);
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const viewAllEventCategory = async (req, res) => {
  try {
    const query = "SELECT * FROM tbl_category";

    const data = await executeQuery(query);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No event category found.");
    }

    sendResponse(res, 200, true, "Display all event categories", data);
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const viewEventCategoryById = async (req, res) => {
  const id = req.params.id;

  try {
    const query = "SELECT * FROM tbl_category WHERE id = ?";

    const data = await executeQuery(query, [id]);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No event category found.");
    }

    sendResponse(
      res,
      200,
      true,
      `Display event category with id : ${id}`,
      data
    );
  } catch (error) {}
};

const createEventCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const query = "INSERT INTO tbl_category(name) VALUES (?)";

    await executeQuery(query, [name]);
    sendResponse(res, 200, true, "Created category successfully");
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const updateEventCategory = async (req, res) => {
  const { name } = req.body;
  const id = req.params.id;

  try {
    const query = "SELECT name FROM tbl_category WHERE id = ?";

    const data = await executeQuery(query, [id]);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "Event category not found.");
    }

    const updateQuery = "UPDATE tbl_category SET name = ? WHERE id = ?";

    await executeQuery(updateQuery, [name, id]);

    sendResponse(res, 200, true, "Updated event category sucessfully.");
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const deleteEventCategory = async (req, res) => {
  const id = req.params.id;

  try {
    const query = "SELECT name FROM tbl_category WHERE id = ?";

    const data = await executeQuery(query, [id]);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "Event category not found.");
    }

    const deleteQuery = "DELETE FROM tbl_category WHERE id = ?";

    await executeQuery(deleteQuery, [id]);

    sendResponse(
      res,
      200,
      true,
      `Delete event category with id : ${id} successfully.`
    );
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

module.exports = {
  viewEvent,
  searchEvent,
  filterEvent,
  viewEventDetail,
  viewAllEventCategory,
  viewEventCategoryById,
  createEventCategory,
  updateEventCategory,
  deleteEventCategory,
};
