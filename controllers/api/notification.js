const bcrypt = require("bcrypt");
const fs = require("fs");
const moment = require("moment");
const { handleResponseError } = require("../../utils/handleError");
const { executeQuery } = require("../../utils/dbQuery");
const { sendResponse } = require("../../utils/response");

const getNotifications = async (req, res) => {
  const { id: userId = 1 } = req.user;
  const { read = false, order = 'desc' } = req.query; // Extract sorting parameters from query

  let notiSql = `
  SELECT 
    -- Notification Data
    tn.id AS notification_id,
    tnt.id AS notification_type_id,
    tnt.name AS notification_type,
    tn.eng_message AS notification_eng_message,
    tn.kh_message AS notification_kh_message,
    tnt.eng_title AS notification_eng_title,
    tnt.kh_title AS notification_kh_title,
    tn.is_read AS notification_is_read,
    tn.created_at AS notification_created_at,
    tn.updated_at AS notification_updated_at,

    -- Receiver (User) Data
    -- tr.id AS receiver_id,
    -- tr.kh_name AS receiver_kh_name,
    -- tr.eng_name AS receiver_eng_name,
    -- tr.email AS receiver_email,
    -- tr.phone AS receiver_phone,
    -- tr.avatar AS receiver_avatar,
    -- tr.address AS receiver_address,
    -- tr.role AS receiver_role,
    -- tr.created_at AS receiver_created_at,
    -- tr.updated_at AS receiver_updated_at,

    -- Sender (User) Data
    ts.id AS sender_id,
    ts.kh_name AS sender_kh_name,
    ts.eng_name AS sender_eng_name,
    ts.email AS sender_email,
    ts.phone AS sender_phone,
    ts.avatar AS sender_avatar,

    ts.role AS sender_role,

    -- Event Data
    te.id AS event_id,
    te.eng_name AS event_eng_name,
    te.kh_name AS event_kh_name,
    te.short_description AS event_short_description,
    te.description AS event_description
    -- te.thumbnail AS event_thumbnail,
    -- te.started_date AS event_started_date,
    -- te.ended_date AS event_ended_date,
    -- te.start_time AS event_start_time,
    -- te.end_time AS event_end_time,
    -- te.location AS event_location,
    -- te.event_type AS event_event_type,
    -- te.creator_id AS event_creator_id,
    -- te.qr_img AS event_qr_img,
    -- te.is_published AS event_is_published,

    -- Grouped Category IDs (Distinct to Prevent Duplicates)
    -- GROUP_CONCAT(DISTINCT tec.category_id) AS category_ids,

    -- Grouped Ticket Type IDs (Distinct to Prevent Duplicates)
    -- GROUP_CONCAT(DISTINCT ttet.id) AS ticket_type_ids,

    -- Grouped Agenda IDs (Distinct to Prevent Duplicates)
    -- GROUP_CONCAT(DISTINCT ta.id) AS agenda_ids

    FROM tbl_notification tn
    LEFT JOIN tbl_notification_type tnt ON tnt.id = tn.type_id
    LEFT JOIN tbl_event te ON te.id = tn.event_id
    LEFT JOIN tbl_users tr ON tr.id = tn.receiver_id
    LEFT JOIN tbl_users ts ON ts.id = tn.sender_id
    -- LEFT JOIN tbl_event_category tec ON tec.event_id = te.id
    -- LEFT JOIN tbl_ticketevent_type ttet ON ttet.event_id = te.id  
    -- LEFT JOIN tbl_agenda ta ON te.id = ta.event_id  
    WHERE tn.receiver_id = ?`;

  // Add filter for is_read if provided
  if (read) {
    // const readStatus = read === 'true' ? 1 : 2; 
    notiSql += ` AND tn.is_read = ? `;
  }

  notiSql += `
    GROUP BY tn.id, te.id, tr.id, ts.id
    ORDER BY ${order ? 'notification_created_at ' + (order === 'asc' ? 'ASC' : 'DESC') : 'notification_created_at DESC'}
`;

//   const categorySql = `
//   SELECT id, name 
//   FROM tbl_category 
//   WHERE id IN (?);
// `;

//   const eventTypeSql = `
//   SELECT id, type_name, price, ticket_opacity, ticket_bought 
//   FROM tbl_ticketevent_type 
//   WHERE id IN (?);
// `;

//   const agendaSql = `
//   SELECT id, title, description, start_time, end_time 
//   FROM tbl_agenda 
//   WHERE id IN (?);
// `;

const arrData = [userId];

  try {
    if (read) {
      arrData.push(read === 'true' ? 2 : 1);
    }
    const result = await executeQuery(notiSql, arrData);

    // const categoryPromises = result.map(async (notification) => {
    //   if (notification.category_ids) {
    //     const categoryIds = notification.category_ids.split(",").map(Number);
    //     const categories = await executeQuery(categorySql, [categoryIds]);
    //     notification.event_categories = categories;
    //     delete notification.category_ids;
    //   } else {
    //     notification.event_categories = [];
    //     delete notification.category_ids;
    //   }
    // });

    // const ticketPromises = result.map(async (notification) => {
    //   if (notification.ticket_type_ids) {
    //     const ticketTypeIds = notification.ticket_type_ids.split(",").map(Number);
    //     const tickets = await executeQuery(eventTypeSql, [ticketTypeIds]);
    //     notification.event_tickets = tickets;
    //     delete notification.ticket_type_ids;
    //   } else {
    //     notification.event_tickets = [];
    //     delete notification.ticket_type_ids;
    //   }
    // });

    // const agendaPromises = result.map(async (notification) => {
    //   if (notification.agenda_ids) {
    //     const agendaIds = notification.agenda_ids.split(",").map(Number);
    //     const agenda = await executeQuery(agendaSql, [agendaIds]);
    //     notification.event_agenda = agenda;
    //     delete notification.agenda_ids;
    //   } else {
    //     notification.event_agenda = [];
    //     delete notification.agenda_ids;
    //   }
    // });

    // await Promise.all([...categoryPromises, ...ticketPromises]);

    const notifications = result.map(noti => ({
      id: noti.notification_id,
      type:{
        type_id : noti.notification_type_id,
      type_name: noti.notification_type,
      type_id_status: "1 & 3 Approved, 2 & 4 Rejected, 5 Update Event, 6 Reminder, 7 Event Link Access"
      },
      
      eng_title: noti.notification_eng_title,
      kh_title: noti.notification_kh_title,
      eng_message: noti.notification_eng_message,
      kh_message: noti.notification_kh_message,
      is_read: noti.notification_is_read == 1 ? false:true,
      created_at: noti.notification_created_at,
      updated_at: noti.notification_updated_at,
  
      // Receiver (User) Data
      // receiver: {
      //   id: noti.receiver_id,
      //   kh_name: noti.receiver_kh_name,
      //   eng_name: noti.receiver_eng_name,
      //   email: noti.receiver_email,
      //   phone: noti.receiver_phone,
      //   avatar: noti.receiver_avatar,
      //   address: noti.receiver_address,
      //   role: noti.receiver_role,
      //   created_at: noti.receiver_created_at,
      //   updated_at: noti.receiver_updated_at,
      // },
  
      // Sender (User) Data
      sender: {
        id: noti.sender_id,
        kh_name: noti.sender_kh_name,
        eng_name: noti.sender_eng_name,
        email: noti.sender_email,
        phone: noti.sender_phone,
        avatar: noti.sender_avatar,
        // address: noti.sender_address,
        role: noti.sender_role,
        // created_at: noti.sender_created_at,
        // updated_at: noti.sender_updated_at,
      },
  
      // Event Data
      event: {
        id: noti.event_id,
        eng_name: noti.event_eng_name,
        kh_name: noti.event_kh_name,
        short_description: noti.event_short_description,
        // description: noti.event_description,
        // thumbnail: noti.event_thumbnail,
        // started_date: noti.event_started_date,
        // ended_date: noti.event_ended_date,
        // start_time: noti.event_start_time,
        // end_time: noti.event_end_time,
        // location: noti.event_location,
        // event_type: noti.event_event_type,
        // creator_id: noti.event_creator_id,
        // qr_img: noti.event_qr_img,
        // is_published: noti.event_is_published,
        // categories: noti.event_categories,
        // tickets: noti.event_tickets
      }
    }));

    sendResponse(res, 200, true, "Get All Notifications Successfully.", notifications);
  } catch (error) {
    handleResponseError(res, error);
  }
};

const getNotification = async (req, res) => {
  const { id: notiId } = req.params;
  const {id: userId} = req.user;

  const notiSql = `
  SELECT 
    -- Notification Data
    tn.id AS notification_id,
    tn.title AS notification_title,
    tn.message AS notification_message,
    tn.link AS notification_link,
    tn.is_read AS notification_is_read,
    tn.created_at AS notification_created_at,
    tn.updated_at AS notification_updated_at,

    -- Receiver (User) Data
    tr.id AS receiver_id,
    tr.kh_name AS receiver_kh_name,
    tr.eng_name AS receiver_eng_name,
    tr.email AS receiver_email,
    tr.phone AS receiver_phone,
    tr.avatar AS receiver_avatar,
    tr.address AS receiver_address,
    tr.role AS receiver_role,
    tr.created_at AS receiver_created_at,
    tr.updated_at AS receiver_updated_at,

    -- Sender (User) Data
    ts.id AS sender_id,
    ts.kh_name AS sender_kh_name,
    ts.eng_name AS sender_eng_name,
    ts.email AS sender_email,
    ts.phone AS sender_phone,
    ts.avatar AS sender_avatar,
    ts.address AS sender_address,
    ts.role AS sender_role,
    ts.created_at AS sender_created_at,
    ts.updated_at AS sender_updated_at,

    -- Event Data
    te.id AS event_id,
    te.eng_name AS event_eng_name,
    te.kh_name AS event_kh_name,
    te.short_description AS event_short_description,
    te.description AS event_description,
    te.thumbnail AS event_thumbnail,
    te.started_date AS event_started_date,
    te.ended_date AS event_ended_date,
    te.start_time AS event_start_time,
    te.end_time AS event_end_time,
    te.location AS event_location,
    te.event_type AS event_event_type,
    te.creator_id AS event_creator_id,
    te.qr_img AS event_qr_img,
    te.is_published AS event_is_published,

    -- Grouped Category IDs (Distinct to Prevent Duplicates)
    GROUP_CONCAT(DISTINCT tec.category_id) AS category_ids,

    -- Grouped Ticket Type IDs (Distinct to Prevent Duplicates)
    GROUP_CONCAT(DISTINCT ttet.id) AS ticket_type_ids,

    -- Grouped Agenda IDs (Distinct to Prevent Duplicates)
    GROUP_CONCAT(DISTINCT ta.id) AS agenda_ids

    FROM tbl_notification tn
    LEFT JOIN tbl_event te ON te.id = tn.event_id
    LEFT JOIN tbl_users tr ON tr.id = tn.receiver_id
    LEFT JOIN tbl_users ts ON ts.id = tn.sender_id
    LEFT JOIN tbl_event_category tec ON tec.event_id = te.id
    LEFT JOIN tbl_ticketevent_type ttet ON ttet.event_id = te.id  
    LEFT JOIN tbl_agenda ta ON te.id = ta.event_id  
    WHERE tn.receiver_id = ? AND tn.id = ?
    GROUP BY tn.id, te.id, tr.id, ts.id;
`;

  const categorySql = `
  SELECT id, name 
  FROM tbl_category 
  WHERE id IN (?);
`;

  const eventTypeSql = `
  SELECT id, type_name, price, ticket_opacity, ticket_bought 
  FROM tbl_ticketevent_type 
  WHERE id IN (?);
`;

  const agendaSql = `
  SELECT id, title, description, start_time, end_time 
  FROM tbl_agenda 
  WHERE id IN (?);
`;
  

  try {
    const result = await executeQuery(notiSql, [userId,notiId]);

    if (result.length === 0) {
      return sendResponse(res, 404, false, "Notification not found or you are not authorized.");
    }

    const categoryPromises = result.map(async (notification) => {
      if (notification.category_ids) {
        const categoryIds = notification.category_ids.split(",").map(Number);
        const categories = await executeQuery(categorySql, [categoryIds]);
        notification.event_categories = categories;
        delete notification.category_ids;
      } else {
        notification.event_categories = [];
        delete notification.category_ids;
      }
    });

    const ticketPromises = result.map(async (notification) => {
      if (notification.ticket_type_ids) {
        const ticketTypeIds = notification.ticket_type_ids.split(",").map(Number);
        const tickets = await executeQuery(eventTypeSql, [ticketTypeIds]);
        notification.event_tickets = tickets;
        delete notification.ticket_type_ids;
      } else {
        notification.event_tickets = [];
        delete notification.ticket_type_ids;
      }
    });

    const agendaPromises = result.map(async (notification) => {
      if (notification.agenda_ids) {
        const agendaIds = notification.agenda_ids.split(",").map(Number);
        const agenda = await executeQuery(agendaSql, [agendaIds]);
        notification.event_agenda = agenda;
        delete notification.agenda_ids;
      } else {
        notification.event_agenda = [];
        delete notification.agenda_ids;
      }
    });

    await Promise.all([...categoryPromises, ...ticketPromises, ...agendaPromises]);

    const notification = result.map(noti => ({
      id: noti.notification_id,
      title: noti.notification_title,
      message: noti.notification_message,
      link: noti.notification_link,
      is_read: noti.notification_is_read == 1 ? true:false,
      created_at: noti.notification_created_at,
      updated_at: noti.notification_updated_at,
  
      // Receiver (User) Data
      receiver: {
        id: noti.receiver_id,
        kh_name: noti.receiver_kh_name,
        eng_name: noti.receiver_eng_name,
        email: noti.receiver_email,
        phone: noti.receiver_phone,
        avatar: noti.receiver_avatar,
        address: noti.receiver_address,
        role: noti.receiver_role,
        created_at: noti.receiver_created_at,
        updated_at: noti.receiver_updated_at,
      },
  
      // Sender (User) Data
      sender: {
        id: noti.sender_id,
        kh_name: noti.sender_kh_name,
        eng_name: noti.sender_eng_name,
        email: noti.sender_email,
        phone: noti.sender_phone,
        avatar: noti.sender_avatar,
        address: noti.sender_address,
        role: noti.sender_role,
        created_at: noti.sender_created_at,
        updated_at: noti.sender_updated_at,
      },
  
      // Event Data
      event: {
        id: noti.event_id,
        eng_name: noti.event_eng_name,
        kh_name: noti.event_kh_name,
        short_description: noti.event_short_description,
        description: noti.event_description,
        thumbnail: noti.event_thumbnail,
        started_date: noti.event_started_date,
        ended_date: noti.event_ended_date,
        start_time: noti.event_start_time,
        end_time: noti.event_end_time,
        location: noti.event_location,
        event_type: noti.event_event_type,
        creator_id: noti.event_creator_id,
        qr_img: noti.event_qr_img,
        is_published: noti.event_is_published,
        categories: noti.event_categories,
        tickets: noti.event_tickets,
        agenda: noti.event_agenda
      }
    }));
    //   console.log(res);
    sendResponse(
      res,
      200,
      true,
      "Get Single Notification Sucessfully.",
      notification
    );
  } catch (error) {
    handleResponseError(res, error);
  }
};

const readNotifications = async (req, res) => {
  const { id: userId = 1 } = req.user;
  const sql =
    "UPDATE `tbl_notification` SET `is_read` = 1 WHERE `receiver_id` = ?";
  try {
    const result = await executeQuery(sql, userId);
    //   console.log(res);
    sendResponse(res, 200, true, "Update Read All Notifications Sucessfully.");
  } catch (error) {
    handleResponseError(res, error);
  }
};

const readNotification = async (req, res) => {
  const { id: notiId = 4 } = req.params;
  const { id: userId = 1 } = req.user;

  //   const selectSql = "SELECT * FROM `tbl_notification` WHERE `id` = ?;";

  const sql =
    "UPDATE `tbl_notification` SET `is_read` = 1 WHERE `id` = ? AND `receiver_id` = ?;";
  const params = [notiId, userId];

  try {
    // const noti = await executeQuery(selectSql, notiId);
    const result = await executeQuery(sql, params);
    //   console.log(res);
    sendResponse(
      res,
      200,
      true,
      "Update Read Single Notification Sucessfully."
    );
  } catch (error) {
    handleResponseError(res, error);
  }
};

const unreadNotification = async (req, res) => {
  const { id: notiId = 4 } = req.params;
  const { id: userId = 1 } = req.user;
  const sql =
    "UPDATE `tbl_notification` SET `is_read` = 2 WHERE `id` = ? AND `receiver_id` = ?;";
  const params = [notiId, userId];
  try {
    const result = await executeQuery(sql, params);
    //   console.log(res);
    sendResponse(
      res,
      200,
      true,
      "Update Read Single Notification Sucessfully.",
      result
    );
  } catch (error) {
    handleResponseError(res, error);
  }
};

const deleteNotification = async (req, res) => {
  const { id: notiId = 4 } = req.params;
  const { id: userId = 1 } = req.user;

  const checkSql =
    "SELECT * FROM `tbl_notification` WHERE `id` = ? AND `receiver_id` = ?;";
  const deleteSql =
    "DELETE FROM `tbl_notification` WHERE `id` = ? AND `receiver_id` = ?;";

  const params = [notiId, userId];

  try {
    const notification = await executeQuery(checkSql, params);

    if (notification.length === 0) {
      return sendResponse(
        res,
        404,
        "Notification not found or you are not authorized to delete it."
      );
    }

    await executeQuery(deleteSql, params);
    sendResponse(res, 200, "Delete Notification Successfully.");
  } catch (error) {
    handleResponseError(res, error);
  }
};

const postLink=async (req,res)=>{
  const id=req.params.id;
  const user_id=req.user.id;
  const {event_link}=req.body;
  const regex=/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
  try {
    //check validation url
    const validUrl=event_link.match(regex);
    if(!event_link || !validUrl){
      return sendResponse(res,400,false,"Link to join event must be valid url");
    }

    //update link to event
    const sqlUpdateLink=`UPDATE tbl_event SET join_link=? WHERE id=?`;
    await executeQuery(sqlUpdateLink,[event_link,id]);

    //insert notification to guest
    const sqlGetBuyer=`SELECT buyer_id,eng_name
          from tbl_transaction
          LEFT JOIN tbl_event ON tbl_event.id=event_id
          WHERE event_id=? AND status=2
    `;
    const getBuyer= await executeQuery(sqlGetBuyer,[id]);

    const sqlInsertNotification=`INSERT INTO tbl_notification
    (event_id, receiver_id, eng_message,kh_message,sender_id, type_id) 
    VALUES (?,?,?,?,?,?)`;

    getBuyer.forEach(async (item) => {
      // console.log(user.buyer_id);
      const paramsNotification=[
        id,
        item.buyer_id,
        `The link to join the event "${item.eng_name}" is: ${event_link}`,
        `តំណភ្ជាប់ដើម្បីចូលក្នុងព្រឹត្តិការណ៍ "${item.eng_name}" គឺ៖ ${event_link}`,
        user_id,
        7
      ];
      await executeQuery(sqlInsertNotification, paramsNotification);
    });

    sendResponse(res,200,true,"The Link set successfully and notifications sent to guest!")

  } catch (error) {
    handleResponseError(res,error);
  }
}


module.exports = {
  getNotifications,
  getNotification,
  readNotifications,
  readNotification,
  unreadNotification,
  deleteNotification,
  postLink,
};
