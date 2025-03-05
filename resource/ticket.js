const { executeQuery }=require('../utils/dbQuery');

const reqTicketCollection=async(userId,event_id=null,ticket_type_id=null,req_status=null,page=1, perpage=25, sort='id', order='ASC')=>{
    try {
        page=parseInt(page);
        perpage=parseInt(perpage);
        const offset=(page-1)*perpage;

        let sqlGetReq=`SELECT 
                tts.id AS transaction_id,
                tts.event_id,
                tts.ticket_event_id ,
                ttt.price,
                tts.rejection_reason,
                ttt.type_name AS ticket_type,
                tts.ticket_qty,
                tts.total_amount,
                tts.transaction_img,
                tts.status,
                tts.buyer_id,
                tu.kh_name AS buyer_kh_name,
                tu.eng_name AS buyer_eng_name,
                tu.email,
                tu.avatar,
                tts.created_at,
                tts.updated_at
            FROM tbl_transaction tts
            LEFT JOIN tbl_ticketevent_type ttt ON ttt.id=tts.ticket_event_id
            LEFT JOIN tbl_event te ON te.id=tts.event_id
            LEFT JOIN tbl_users tu ON tu.id= tts.buyer_id
            WHERE te.creator_id=? 
        `;
        let filterQry='';
        const filterParam=[userId];
        if(event_id){
            filterQry +=` AND te.id=?`;
            filterParam.push(event_id);
        }
        if(ticket_type_id){
            filterQry +=` AND tts.ticket_event_id=?`;
            filterParam.push(ticket_type_id);
        }
        if(req_status){
            filterQry +=` AND tts.status=? `;
            filterParam.push(req_status);
        }
        
        sqlGetReq+=filterQry;
        sqlGetReq+=` ORDER BY tts.${sort} ${order}
                    LIMIT ? OFFSET ?;`

        const params=[...filterParam];
        params.push(perpage,offset);

        const result=await executeQuery(sqlGetReq,params);
        const data=[];
        const status={
            1:"Pending",
            2:"Approved",
            3:"Rejected"
        }

        for(i=0;i<result.length ; i++){
            const item=result[i];
            data.push({
                transaction_id : item.transaction_id,
                event_id : item.event_id,
                rejection_reason: item.rejection_reason,
                ticket_type_id: item.ticket_event_id,
                price: item.price,
                ticket_type : item.ticket_type,
                ticket_qty : item.ticket_qty,
                total_amount : item.total_amount,
                transaction_img :item.transaction_img,
                status : status[item.status],
                buyer:{
                    buyer_id: item.buyer_id,
                    kh_name: item.buyer_kh_name,
                    eng_name : item.buyer_eng_name,
                    email: item.email,
                    avatar : item.avatar
                },
                created_at : item.created_at,
                updated_at : item.updated_at
            })
        }

        //totalpage
        let countQueryStr=`SELECT COUNT(tts.id) as total 
                        FROM tbl_transaction tts
                        LEFT JOIN tbl_event te ON te.id=tts.event_id
                        WHERE te.creator_id=?`;
        countQueryStr+=filterQry;

        const countQuery=await executeQuery(countQueryStr,filterParam);
        const totalPage=Math.ceil(countQuery[0].total/perpage); 
        const ticketReqObj={
            rows:data,
            paginate:{
                total: countQuery[0].total,
                perpage: perpage,
                current_page: page,
                total_page: totalPage
            }
        } 
        return ticketReqObj;
    } catch (error) {
        console.log(error);
        // throw error;
    }
}

const ownReqTicketCollection=async(userId,status=null,page=1,perpage=15,sort='id',order='DESC')=>{
    try {
        page=parseInt(page);
        perpage=parseInt(perpage);
        const offset=(page-1)*perpage;
        let sqlGetReq=`
            SELECT 
            tts.id,
            tts.ticket_event_id,
            tts.ticket_qty,
            tts.total_amount,
            tts.transaction_img,
            tts.status,
            tts.rejection_reason,
            tts.created_at,
            tts.updated_at,
            tts.event_id,
            te.eng_name as event_eng_name,
            te.event_type,
            te.kh_name as event_kh_name,
            te.thumbnail as event_thumbnail,
            te.location as event_location,
            te.started_date as event_started_date,
            ttt.type_name,
            ttt.price
        from tbl_transaction tts
        LEFT JOIN tbl_ticketevent_type ttt ON ttt.id=tts.ticket_event_id
        LEFT JOIN tbl_event te ON te.id=tts.event_id
        WHERE buyer_id=? `;
        const filterParam=[userId];
        let sqlFilter='';

        if(status){
            sqlFilter+=` AND tts.status=?`;
            filterParam.push(status);
        }

        sqlGetReq+=sqlFilter;
        sqlGetReq+=` ORDER BY tts.${sort} ${order}
                    LIMIT ? OFFSET ?;`

        const params=[...filterParam];
        params.push(perpage,offset);

        const result=await executeQuery(sqlGetReq,params);
        const data=[];
        const tStatus={
            1:"Pending",
            2:"Approved",
            3:"Rejected"
        }
        for(let i=0;i<result.length; i++){
            const item=result[i];
            data.push({
                id : item.id,
                
                event : {
                    id: item.event_id,
                    eng_name: item.event_eng_name,
                    kh_name: item.event_kh_name,
                    location: item.event_location,
                    thumbnail: item.event_thumbnail,
                    event_type: item.event_type,
                    started_date: item.event_started_date
                },
                ticket_type:{
                    ticket_event_id: item.ticket_event_id,
                    type_name : item.type_name,
                    price: item.price
                },
                quantity: item.ticket_qty,
                amount:item.total_amount,
                transaction_img: item.transaction_img,
                status: tStatus[item.status],
                reject_reason: item.rejection_reason,
                created_at: item.created_at,
                updated_at: item.updated_at
            })
        }

        //totalpage
        let countQueryStr=`SELECT COUNT(tts.id) as total 
                        FROM tbl_transaction tts
                        WHERE tts.buyer_id=? `;
        countQueryStr+=sqlFilter;

        const countQuery=await executeQuery(countQueryStr,filterParam);
        const totalPage=Math.ceil(countQuery[0].total/perpage); 
        const ticketReqObj={
            rows:data,
            paginate:{
                total: countQuery[0].total,
                perpage: perpage,
                current_page: page,
                total_page: totalPage
            }
        } 
        return ticketReqObj;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const ownTicketCollection=async(userId,status=null,page=1,perpage=15,sort='id',order='DESC')=>{
    try {
        page=parseInt(page);
        perpage=parseInt(perpage);
        const offset=(page-1)*perpage;
        let sqlGetTicket=`
            SELECT 
                tt.id,
                tt.transaction_id,
                tt.qr_code_img,
                tt.status,
                tt.created_at,
                tt.updated_at,
                tts.event_id,
                te.eng_name,
                te.kh_name,
                te.started_date,
                te.ended_date,
                te.start_time,
                te.end_time,
                te.location,
                te.thumbnail,
                tor.user_id,
                tor.organization_name,
                tor.business_email,
                tor.business_phone,
                ttt.type_name,
                ttt.price
            FROM tbl_ticket tt
            INNER JOIN tbl_transaction tts ON tts.id=tt.transaction_id
            INNER JOIN tbl_ticketevent_type ttt ON ttt.id=tt.ticket_event_id
            INNER JOIN tbl_event te ON te.id=tts.event_id
            INNER JOIN tbl_organizer tor ON tor.user_id=te.creator_id
            WHERE tts.buyer_id=?
        `;

        const filterParam=[userId];
        let sqlFilter='';

        if(status){
            sqlFilter+=` AND tt.status=?`;
            filterParam.push(status);
        }

        sqlGetTicket+=sqlFilter;
        sqlGetTicket+=` ORDER BY tt.${sort} ${order}
                    LIMIT ? OFFSET ?;`

        const params=[...filterParam];
        params.push(perpage,offset);

        // const result=await executeQuery(sqlGetTicket,params);
        const result=await executeQuery(sqlGetTicket,params);
        const data=[];
        const tStatus={
            1:"Issue",
            2:"Used"
        }
        for(let i=0;i<result.length; i++){
            const item=result[i];
            data.push({
                id : item.id,
                transaction_id : item.transaction_id,
                qr_code_img: item.qr_code_img,
                status : tStatus[item.status],
                ticket_type: item.type_name,
                price: item.price,
                event: {
                    id: item.event_id,
                    eng_name : item.eng_name,
                    kh_name : item.kh_name,
                    started_date: item.started_date,
                    ended_date: item.ended_date,
                    start_time: item.start_time,
                    end_time: item.end_time,
                    location: item.location,
                    thumbnail: item.thumbnail,
                    creator:{
                        id:item.user_id,
                        name: item.organization_name,
                        email:item.business_email,
                        phone: item.business_phone
                    }
                },
                created_at: item.created_at,
                updated_at : item.updated_at
            })
        }

        //totalpage
        let countQueryStr=`SELECT COUNT(tt.id) as total 
                        FROM tbl_ticket tt
                        INNER JOIN tbl_transaction tts ON tts.id=tt.transaction_id
                        WHERE tts.buyer_id=? `;
        countQueryStr+=sqlFilter;

        const countQuery=await executeQuery(countQueryStr,filterParam);
        const totalPage=Math.ceil(countQuery[0].total/perpage); 
        const ticketObj={
            rows:data,
            paginate:{
                total: countQuery[0].total,
                perpage: perpage,
                current_page: page,
                total_page: totalPage
            }
        } 
        return ticketObj;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const checkInTicketCollection= async (id)=>{
    try {
        const sqlGetCheckin=`SELECT 
            tt.id, 
            tt.transaction_id,
            tt.status,
            ttt.type_name,
            tu.eng_name,
            tu.email,
            tu.avatar,
            tt.updated_at as checkin_at
        FROM tbl_ticket tt
        LEFT JOIN tbl_ticketevent_type ttt ON ttt.id=tt.ticket_event_id
        LEFT JOIN tbl_transaction tts ON tts.id=tt.transaction_id
        LEFT JOIN tbl_users tu ON tu.id=tts.buyer_id
        WHERE tt.status=2 AND ttt.event_id=?`;

        const result = await executeQuery(sqlGetCheckin,[id]);
        return result;

    } catch (error) {
        console.log(error);
    }
}

module.exports={
    reqTicketCollection,
    ownReqTicketCollection,
    ownTicketCollection,
    checkInTicketCollection
};