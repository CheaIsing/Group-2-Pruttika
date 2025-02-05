const { executeQuery } = require("../../../utils/dbQuery");
const { handleResponseError } = require("../../../utils/handleError");
const { sendResponse } = require("../../../utils/response");

const viewEvent = async (req, res) => {
  try {
    const { category_id, search } = req.query;
    let {
      page = 1,
      per_page = 50,
      sort_col = "eng_name",
      sort_dir = "asc",
    } = req.query;

    const pageNum = parseInt(page);
    const perPageNum = parseInt(per_page);

    if (isNaN(pageNum) || pageNum < 1)
      return sendResponse(res, 400, false, "Invalid page number.");
    if (isNaN(perPageNum) || perPageNum < 1)
      return sendResponse(res, 400, false, "Invalid per_page value.");

    const sortDirection = sort_dir.toLowerCase() === "desc" ? "DESC" : "ASC";

    let query = `
      SELECT 
        e.id, e.eng_name, e.short_description, e.thumbnail, 
        e.started_date, e.ended_date, e.location, 
        e.event_type, e.is_published, c.name AS category_name
      FROM tbl_event AS e
      LEFT JOIN tbl_event_category AS ec ON e.id = ec.event_id
      LEFT JOIN tbl_category AS c ON ec.category_id = c.id
    `;

    const queryParams = [];

    if (category_id) {
      query += " WHERE c.id = ?";
      queryParams.push(category_id);
    }

    if (search) {
      query += category_id ? " AND" : " WHERE";
      query += " e.eng_name LIKE ?";
      queryParams.push(`%${search}%`);
    }

    query += ` ORDER BY ${sort_col} ${sortDirection}`;

    query += " LIMIT ? OFFSET ?";
    queryParams.push(perPageNum, (pageNum - 1) * perPageNum);

    const data = await executeQuery(query, queryParams);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No events found.");
    }

    sendResponse(res, 200, true, "Display all events.", data);
  } catch (error) {
    console.error(error);
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
    let {
      page = 1,
      per_page = 50,
      sort_col = "name",
      sort_dir = "asc",
      search,
    } = req.query;

    page = parseInt(page);
    per_page = parseInt(per_page);

    sort_dir = sort_dir.toLowerCase() === "desc" ? "DESC" : "ASC";

    let query = "SELECT * FROM tbl_category";
    let queryParams = [];

    if (search) {
      query += " WHERE name LIKE ?";
      queryParams.push(`%${search}%`);
    }

    query += ` ORDER BY ${sort_col} ${sort_dir}`;

    query += " LIMIT ? OFFSET ?";
    queryParams.push(per_page, (page - 1) * per_page);

    const data = await executeQuery(query, queryParams);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No event categories found.");
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
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
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
  viewEventDetail,
  viewAllEventCategory,
  viewEventCategoryById,
  createEventCategory,
  updateEventCategory,
  deleteEventCategory,
};
