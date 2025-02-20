const { executeQuery } = require("../utils/dbQuery");
const { eventCategories, eventTicket } = require("./event");

const wishlistCollection = async (user_id) => {
  try {
    const query = `SELECT 
                tw.id,
                tw.event_id,
                    te.eng_name,
                    te.short_description,
                    te.thumbnail, 
                    te.started_date,
                    te.ended_date,
                    te.start_time,
                    te.end_time,
                    te.location,
                    te.event_type,
                    te.created_at,
                    te.updated_at,
                    te.creator_id,
                    tor.organization_name,
                    tu.avatar,
                    GROUP_CONCAT(DISTINCT tec.category_id) AS category_ids,
                    GROUP_CONCAT(DISTINCT tc.name) AS category_names,
                    ticket_info.ticket_type_id,
                    ticket_info.ticket_type_names,
                    ticket_info.ticket_price,
                    ticket_info.ticket_opacity,
                    ticket_info.ticket_bought 
                FROM tbl_wishlist tw
                INNER JOIN tbl_event te ON te.id=tw.event_id
                INNER JOIN tbl_organizer tor ON tor.user_id = te.creator_id
                LEFT JOIN tbl_users tu ON tu.id=te.creator_id
                LEFT JOIN tbl_event_category tec ON te.id = tec.event_id
                LEFT JOIN tbl_category tc ON tc.id = tec.category_id
                LEFT JOIN (
                    SELECT 
                        event_id,
                        GROUP_CONCAT(id) AS ticket_type_id,
                        GROUP_CONCAT(type_name) AS ticket_type_names,
                        GROUP_CONCAT(price) AS ticket_price,
                        GROUP_CONCAT(ticket_opacity) AS ticket_opacity,
                        GROUP_CONCAT(ticket_bought) AS ticket_bought
                    FROM 
                        tbl_ticketevent_type
                    GROUP BY 
                        event_id
                ) ticket_info ON te.id = ticket_info.event_id
                WHERE tw.user_id=?
                GROUP BY te.id
                ORDER BY tw.id DESC
        `;

    const result = await executeQuery(query, [user_id]);

    const data = [];
    for (let i = 0; i < result.length; i++) {
      const eventData = result[i];
      const event = {
        id: eventData.id,
        event_id: eventData.event_id,
        eng_name: eventData.eng_name,
        short_description: eventData.short_description,
        thumbnail: eventData.thumbnail,
        started_date: eventData.started_date,
        ended_date: eventData.ended_date,
        start_time: eventData.start_time,
        end_time: eventData.end_time,
        location: eventData.location,
        event_type: eventData.event_type == 1 ? "online" : "offline",
        event_categories: eventCategories(eventData),
        event_tickets: eventTicket(eventData),
        creator: {
          id: eventData.creator_id,
          name: eventData.organization_name,
          avatar: eventData.avatar,
        },
        created_at: eventData.created_at,
        updated_at: eventData.updated_at,
      };

      data.push(event);
    }

    return data;

  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  wishlistCollection,
};
