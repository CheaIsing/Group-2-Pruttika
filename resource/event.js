const { executeQuery }=require('../utils/dbQuery');

const joinEventQry=`SELECT
                te.id,
                te.eng_name,
                te.kh_name,
                te.short_description,
                te.thumbnail, 
                te.started_date,
                te.ended_date,
                te.start_time,
                te.end_time,
                te.location,
                te.event_type,
                te.is_published,
                te.created_at,
                te.updated_at,
                te.qr_img,
                te.creator_id,
                tor.organization_name,
                GROUP_CONCAT(DISTINCT tec.category_id) AS category_ids,
                GROUP_CONCAT(DISTINCT tc.name) AS category_names,
                ticket_info.ticket_type_id,
                ticket_info.ticket_type_names,
                ticket_info.ticket_price,
                ticket_info.ticket_opacity,
                ticket_info.ticket_bought,
                agenda_info.agenda_id,
                agenda_info.agenda_title,
                agenda_info.agenda_description,
                agenda_info.agenda_start_time,
                agenda_info.agenda_end_time
            FROM  
                tbl_event te 
            INNER JOIN 
                tbl_organizer tor ON tor.user_id = te.creator_id
            LEFT JOIN 
                tbl_event_category tec ON te.id = tec.event_id
            LEFT JOIN 
                tbl_category tc ON tc.id = tec.category_id
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
             LEFT JOIN (
                SELECT 
                    event_id,
                    GROUP_CONCAT(id) AS agenda_id,
                    GROUP_CONCAT(title) AS agenda_title,
                    GROUP_CONCAT(description) AS agenda_description,
                    GROUP_CONCAT(start_time) AS agenda_start_time,
                    GROUP_CONCAT(end_time) AS agenda_end_time
                FROM 
                    tbl_agenda
                GROUP 
                    BY event_id
            ) agenda_info ON te.id = agenda_info.event_id 
        `;

const getData=async(sqlQuery,params)=>{
    const result=await executeQuery(sqlQuery,params);
    const arrEvents=[];

    for(let i=0;i<result.length;i++){
        const eventData=result[i];

        const categoryIds = eventData.category_ids ? eventData.category_ids.split(',') : [];
        const categoryNames = eventData.category_names ? eventData.category_names.split(',') : [];

        const ticketIds=eventData.ticket_type_id ? eventData.ticket_type_id.split(',') : [];
        const ticketNames=eventData.ticket_type_names ? eventData.ticket_type_names.split(',') : [];
        const ticketPrice=eventData.ticket_price ? eventData.ticket_price.split(',') : [];
        const ticketOpacity=eventData.ticket_opacity ? eventData.ticket_opacity.split(',') : [];
        const ticketBought=eventData.ticket_bought ? eventData.ticket_bought.split(',') : [];

        const event={
            id:eventData.id,
            eng_name:eventData.eng_name,
            kh_name:eventData.kh_name,
            short_description:eventData.short_description,
            thumbnail: eventData.thumbnail,
            started_date : eventData.started_date,
            ended_date: eventData.ended_date,
            start_time: eventData.start_time,
            end_time: eventData.end_time,
            location: eventData.location,
            event_type : eventData.event_type==1 ? "online":"offline",
            event_categories:[],
            event_tickets:[],
            qr_img:eventData.qr_img,
            creator:{
                id:eventData.creator_id,
                name:eventData.organization_name
            },
            is_published: eventData.is_published==1? true:false,
            created_at: eventData.created_at,
            updated_at: eventData.updated_at
        }
        for(let j=0;j<categoryIds.length;j++){
            event.event_categories.push(
                {
                    id: Number(categoryIds[j]),
                    name: categoryNames[j]
                }
            );
        }
        for(let k=0;k<ticketIds.length;k++){
            event.event_tickets.push(
                {
                    id: Number(ticketIds[k]),
                    type: ticketNames[k],
                    price: parseFloat(ticketPrice[k]),
                    ticket_opacity: Number(ticketOpacity[k]),
                    ticket_bought : Number(ticketBought[k])
                }
            )
        }
        arrEvents.push(event);
    }
    // console.log(arrEvents);
    return arrEvents;
}

const eventCollection= async(page=1, perpage=10, search='', sort='id', order='ASC', start_date = null, end_date = null, event_type = null, min_price = null, max_price = null, cate_ids = [])=>{
    try {
        page=parseInt(page);
        perpage=parseInt(perpage);
        const offset=(page-1)*perpage;
        let sqlQuery=joinEventQry+ ` WHERE (te.eng_name LIKE ? OR te.kh_name LIKE ?) `;
    
        //params
        const searchPattern=`%${search}%`;
        const filterParams=[searchPattern,searchPattern];

        //filter
        let filterQuery='';

        //filter by date
        if(start_date){
            filterQuery += ` AND te.started_date >= ?`;
            // params.push(start_date);
            filterParams.push(start_date);
        }
        if(end_date){
            filterQuery+= ` AND te.ended_date <= ?`;
            filterParams.push(end_date);
        }

        //filter by price
        if (min_price !== null || max_price !== null) {
            filterQuery += ` AND te.id IN (
                SELECT event_id FROM tbl_ticketevent_type WHERE 1=1
                ${min_price !== null ? `AND price >= ?` : ''}
                ${max_price !== null ? `AND price <= ?` : ''}
                GROUP BY event_id
            )`;
            if (min_price !== null) filterParams.push(min_price);
            if (max_price !== null) filterParams.push(max_price);
        }

        //filter by event_type
        if(event_type){
            filterQuery +=` AND te.event_type = ?`;
            filterParams.push(event_type);
        }

        // Filter by category
        const cateId = Array.isArray(cate_ids) ? cate_ids.map(Number) : [Number(cate_ids)];
        if (cateId.length > 0) {
            const placeholders = cateId.map(() => '?').join(', ');
            filterQuery += ` AND tec.category_id IN (${placeholders})`;
            filterParams.push(...cateId); //push category to param
        }

        sqlQuery+=filterQuery; //combine filter query
        sqlQuery+=` GROUP BY te.id
                    ORDER BY te.${sort} ${order}
                    LIMIT ? OFFSET ?;`;

        const params=[...filterParams];
        params.push(perpage,offset);

        //get all data event
        const data=await getData(sqlQuery,params);
        // console.log(data);

        //totalpage
        let countQueryStr=`SELECT COUNT(DISTINCT te.id) as total FROM tbl_event te
                            INNER JOIN tbl_organizer tor ON tor.user_id = te.creator_id
                            LEFT JOIN tbl_event_category tec ON te.id = tec.event_id
                            LEFT JOIN tbl_category tc ON tc.id = tec.category_id
                            LEFT JOIN (
                                SELECT 
                                    event_id,
                                    GROUP_CONCAT(id) AS ticket_type_id,
                                    GROUP_CONCAT(price) AS ticket_price
                                FROM 
                                    tbl_ticketevent_type
                                GROUP BY 
                                    event_id
                            ) ticket_info ON te.id = ticket_info.event_id
                            WHERE (te.eng_name LIKE ? OR te.kh_name LIKE ?)`;
        countQueryStr+=filterQuery;
        // console.log(filterParams);
        // console.log("count param"+countParams);
        const countQuery=await executeQuery(countQueryStr,filterParams);
        // console.log(countQuery);
        const totalPage=Math.ceil(countQuery[0].total/perpage); 

        const eventObj={
            rows:data,
            paginate:{
                total: countQuery[0].total,
                perpage: perpage,
                currect_page: page,
                total_page: totalPage
            }
        }        
        return eventObj;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const eventDetail=async(id)=>{
    const sqlQuery=joinEventQry+ ` WHERE te.id=? `;
    const dataEvent=await getData(sqlQuery,id);
    console.log(dataEvent);
    const data=await executeQuery(sqlQuery,id);
    const agendaIds = data[0].agenda_id ? data[0].agenda_id.split(',') : [];
    const agendaTitle = data[0].agenda_title ? data[0].agenda_title.split(',') : [];
    const agendaDescription = data[0].agenda_description ? data[0].agenda_description.split(',') : [];
    const agendaStart_time = data[0].agenda_start_time ? data[0].agenda_start_time.split(',') : [];
    const agendaEnd_time = data[0].agenda_end_time ? data[0].agenda_end_time.split(',') : [];
    let agenda=[];
    for(let i=0;i<agendaIds.length;i++){
        agenda.push(
            {
                id: agendaIds[i],
                title: agendaTitle[i],
                agendaDescription: agendaDescription[i],
                agendaStart_time : agendaStart_time[i],
                agendaEnd_time : agendaEnd_time[i]
            }
        )
    }
    const eventDetail={...dataEvent[0],agenda};
    // console.log(eventDetail);
    return eventDetail;
}


module.exports={
    eventCollection,
    eventDetail
}