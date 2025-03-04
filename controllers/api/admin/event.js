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
      SELECT e.* FROM tbl_event e
      JOIN tbl_event_category ec ON e.id = ec.event_id
      JOIN tbl_category c ON ec.category_id = c.id`;

    let countQuery = `
      SELECT COUNT(DISTINCT e.id) AS total FROM tbl_event e
      JOIN tbl_event_category ec ON e.id = ec.event_id
      JOIN tbl_category c ON ec.category_id = c.id`;

    const queryParams = [];
    const countParams = [];
    let whereClause = [];

    if (category_id) {
      whereClause.push("c.id = ?");
      queryParams.push(category_id);
      countParams.push(category_id);
    }

    if (search) {
      whereClause.push("e.eng_name LIKE ?");
      queryParams.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    if (whereClause.length > 0) {
      query += " WHERE " + whereClause.join(" AND ");
      countQuery += " WHERE " + whereClause.join(" AND ");
    }

    const countResult = await executeQuery(countQuery, countParams);
    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / perPageNum);

    query += ` GROUP BY e.id ORDER BY ${sort_col} ${sortDirection} LIMIT ? OFFSET ?`;
    queryParams.push(perPageNum, (pageNum - 1) * perPageNum);

    const data = await executeQuery(query, queryParams);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No events found.");
    }

    sendResponse(res, 200, true, "Display all events.", {
      data,
      pagination: {
        total,
        current_page: pageNum,
        per_page: perPageNum,
        total_pages: totalPages,
      },
    });
  } catch (error) {
    console.error(error);
    handleResponseError(res, error);
  }
};

const viewEventDetail = async (req, res) => {
  const id = req.params.id;

  try {
    const eventQuery = `
      SELECT 
        e.id, e.eng_name, e.kh_name, e.short_description, e.description, e.thumbnail,
        e.started_date, e.ended_date, e.start_time, e.end_time, e.location, 
        e.event_type, e.qr_img, e.is_published, e.created_at, e.updated_at, e.creator_id,
        o.organization_name AS creator_name, u.avatar AS creator_avatar
      FROM tbl_event e
      LEFT JOIN tbl_organizer o ON e.creator_id = o.id
      LEFT JOIN tbl_users u ON o.user_id = u.id
      WHERE e.id = ?
    `;
    const eventData = await executeQuery(eventQuery, [id]);

    if (eventData.length === 0) {
      sendResponse(res, 404, false, "Event not found", null);
      return;
    }

    const categoryQuery = `
      SELECT ec.category_id AS id, c.name 
      FROM tbl_event_category ec
      JOIN tbl_category c ON ec.category_id = c.id
      WHERE ec.event_id = ?
    `;
    const eventCategories = await executeQuery(categoryQuery, [id]);

    const eventDetail = {
      result: true,
      message: "Get event detail successfully",
      data: {
        id: eventData[0].id,
        eng_name: eventData[0].eng_name,
        kh_name: eventData[0].kh_name,
        short_description: eventData[0].short_description,
        description: eventData[0].description,
        thumbnail: eventData[0].thumbnail,
        started_date: eventData[0].started_date,
        ended_date: eventData[0].ended_date,
        start_time: eventData[0].start_time,
        end_time: eventData[0].end_time,
        location: eventData[0].location,
        event_type: eventData[0].event_type,
        event_categories: eventCategories,
        qr_img: eventData[0].qr_img,
        creator: {
          id: eventData[0].creator_id,
          name: eventData[0].creator_name,
          avatar: eventData[0].creator_avatar,
        },
        is_published: eventData[0].is_published,
        created_at: eventData[0].created_at,
        updated_at: eventData[0].updated_at,
      },
    };

    sendResponse(res, 200, true, "Display event detail", eventDetail);
  } catch (error) {
    console.log(error);
    handleResponseError(res, error);
  }
};

const viewAllEventCategory = async (req, res) => {
  try {
    const { search } = req.query;
    let {
      page = 1,
      per_page = 50,
      sort_col = "name",
      sort_dir = "asc",
    } = req.query;

    const pageNum = parseInt(page);
    const perPageNum = parseInt(per_page);

    if (isNaN(pageNum) || pageNum < 1)
      return sendResponse(res, 400, false, "Invalid page number.");
    if (isNaN(perPageNum) || perPageNum < 1)
      return sendResponse(res, 400, false, "Invalid per_page value.");

    const sortDirection = sort_dir.toLowerCase() === "desc" ? "DESC" : "ASC";

    let query = `SELECT * FROM tbl_category`;
    let countQuery = `SELECT COUNT(*) AS total FROM tbl_category`;
    const queryParams = [];
    const countParams = [];

    if (search) {
      query += " name LIKE ?";
      countQuery += " name LIKE ?";
      queryParams.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    const countResult = await executeQuery(countQuery, countParams);
    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / perPageNum);

     query += ` ORDER BY ${sort_col} ${sortDirection} LIMIT ? OFFSET ?`;
    queryParams.push(perPageNum, (pageNum - 1) * perPageNum);

    const data = await executeQuery(query, queryParams);

    if (data.length === 0) {
      return sendResponse(res, 404, false, "No categories found.");
    }

    sendResponse(res, 200, true, "Display all categories", {
      data,
      pagination: {
        total,
        current_page: pageNum,
        per_page: perPageNum,
        total_pages: totalPages,
      },
    });
  } catch (error) {
    console.error(error);
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
