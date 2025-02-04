const con=require('../../config/db');
const fs=require('fs');
const {vCreateEvent, vAgendaSchema}=require("../../validations/event");
const {
    handleResponseError,
    handleValidateError,
  } = require("../../utils/handleError");
const { executeQuery } = require("../../utils/dbQuery");
// const { sendResponse ​} = require("../../utils/response");
const {sendResponse ,sendResponse1}= require("../../utils/response");
const {eventCollection , eventDetail}= require("../../resource/event");

const default_img="default-events-img.jpg";

const getAllEvent=async(req,res)=>{
    // const sqlgetEvent=`SELECT * FROM tbl_event`;
    // const result=await executeQuery(sqlInsertE, arrEvent);

    try {
        
        const data= await eventCollection(
            req.query.page, req.query.perpage,
            req.query.search, req.query.sort, req.query.order, 
            req.query.start_date, req.query.end_date,
            req.query.event_type, 
            req.query.min_price, req.query.max_price,
            req.query.cateId
        );
        // const result=data;
        sendResponse1(res, 200, true,"Get all event successfully", data.rows,data.paginate);
    } catch (error) {
        handleResponseError(res, error);
    }
}

const getEventDetail=async(req,res)=>{
    const event_id=req.params.id;
    try {
        const result=await eventDetail(event_id);
        sendResponse1(res, 200, true,"Get event detail successfully", result);
    } catch (error) {
        handleResponseError(res, error);
    }
}

const postCreateEvent=async(req,res)=>{
    //validation
    const { error} = vCreateEvent.validate(req.body);
    if (handleValidateError(error, res)) return;
    // Validate each agenda
    const agendaErrors = [];
    for (const ag of req.body.agenda) {
        const { error } = vAgendaSchema.validate(ag);
        if (error) {
            agendaErrors.push(error.message);
        }
    }
    if (agendaErrors.length > 0) {
        return res.status(400).json({ message: 'Validation errors', errors: agendaErrors });
    }

    for (const key in req.body) {
        if (req.body[key] === "") {
            req.body[key] = null; // Set empty strings to null
        }
    }
    const user_id=req.user.id;
    const { 
        eng_name, 
        kh_name, 
        short_description, 
        description, 
        started_date,
        ended_date,
        start_time,
        end_time,
        location,
        event_type,
        event_categories,
        event_tickets,
        agenda,
        is_published
    } = req.body;

    try {
        //Insert the event into the tbl_event
        const sqlInsertE=`
            INSERT INTO tbl_event 
            (eng_name, kh_name,short_description, description,thumbnail, started_date,
            ended_date, start_time, end_time, location,event_type, creator_id, is_published) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;
        const arrEvent=[
            eng_name,
            kh_name,
            short_description,
            description,
            default_img,
            started_date,
            ended_date,
            start_time,
            end_time,
            location,
            event_type,
            user_id,
            is_published
        ];

        const eventQresult=await executeQuery(sqlInsertE,arrEvent);
        // console.log("eventQresult Insert success");
        const eventId = eventQresult.insertId;

        // Insert tickets to tbl_ticketevent_type
        for (const ticket of event_tickets) {
            const sqlInsertTicket = `
                INSERT INTO tbl_ticketevent_type(event_id, type_name, price, ticket_opacity) VALUES (?,?,?,?)
            `;
            await executeQuery(sqlInsertTicket, [eventId, ticket.type, ticket.price, ticket.ticket_opacity]);
        }
    
        //Insert categories to tbl_event_categories
        for (const categoryId of event_categories) {
            const sqlInsertECategory = `
                INSERT INTO tbl_event_category (event_id, category_id) VALUES (?, ?)
            `;
            await executeQuery(sqlInsertECategory, [eventId, categoryId]);
        }

        //Insert agenda
        for(const agd of agenda){
            // console.log(agd);
            const sqlInsertAgenda=`
                INSERT INTO tbl_agenda(event_id, title, description, start_time, end_time) VALUES(?,?,?,?,?) 
            `;
            await executeQuery(sqlInsertAgenda,[eventId, agd.title, agd.description, agd.start_time, agd.end_time]);
        }
        sendResponse(res, 200, true, "Event created successfully",{event_id: eventId});
    } catch (error) {
        console.error(error);
        // res.status(500).json({ message: 'Error creating event', error });
        handleResponseError(res, error);
    }
}

const putEditEvent= async(req,res)=>{
    //validation
    const {error} = vCreateEvent.validate(req.body);
    if (handleValidateError(error, res)) return;

    // Validate each agenda
    const agendaErrors = [];
    for (const ag of req.body.agenda) {
        const { error } = vAgendaSchema.validate(ag);
        if (error) {
            agendaErrors.push(error.message);
        }
    }
    if (agendaErrors.length > 0) {
        return res.status(400).json({ message: 'Validation errors', errors: agendaErrors });
    }

    // set other empty key to null
    for (const key in req.body) {
        if (req.body[key] === "") {
            req.body[key] = null; // Set empty strings to null
        }
    }

    const { 
        eng_name, 
        kh_name, 
        short_description, 
        description, 
        started_date,
        ended_date,
        start_time,
        end_time,
        location,
        event_type,
        event_categories,
        event_tickets,
        agenda,
        is_published
    } = req.body;
    let event_id=req.params.id;

    // return
        try {
            const sqlUpdateEvent=`
                UPDATE tbl_event SET
                    eng_name=? ,
                    kh_name=? ,
                    short_description=? ,
                    description=? ,
                    started_date=? ,
                    ended_date=? ,
                    start_time=? ,
                    end_time=? ,
                    location=? ,
                    event_type=? ,
                    is_published=?
                WHERE id=?
            `;
            const arrEvent=[
                eng_name,
                kh_name,
                short_description,
                description,
                started_date,
                ended_date,
                start_time,
                end_time,
                location,
                event_type,
                is_published,
                event_id
            ];
            await executeQuery(sqlUpdateEvent, arrEvent);

            //tbl_ticket_event
            for (const ticket of event_tickets) {
                if(!ticket.id){
                    //insert new ticket_event
                    const sqlInsertTicket = `
                         INSERT INTO tbl_ticketevent_type (event_id, type_name, price, ticket_opacity) 
                         VALUES (?, ?, ?, ?)
                    `;
                    await executeQuery(sqlInsertTicket, [event_id, ticket.type, ticket.price, ticket.ticket_opacity]);
                }else{
                    //check if event ticket exists
                    const sqlCheckTicket=`select * from tbl_ticketevent_type where id=? AND event_id=?`;
                    const checkResult= await executeQuery(sqlCheckTicket,[ticket.id,event_id]);
                    if(checkResult.length>0){
                        const sqlUpdate=`
                            UPDATE tbl_ticketevent_type 
                            SET type_name = ?, price = ?, ticket_opacity = ? 
                            WHERE id = ? 
                        `;
                        await executeQuery(sqlUpdate,[ticket.type,ticket.price,ticket.ticket_opacity,ticket.id]);
                    }else{
                        return res.status(404).json({ error: "Ticket not found", ticketId: ticket.id });
                    }
                }
            }

            //tbl_agenda
            for (const agd of agenda) {
                if(!agd.id){
                    //insert new agenda_event
                    const sqlInsertAgenda=`
                        INSERT INTO tbl_agenda(event_id, title, description, start_time, end_time) VALUES(?,?,?,?,?) 
                    `;
                    await executeQuery(sqlInsertAgenda,[event_id, agd.title, agd.description, agd.start_time, agd.end_time]);
                }else{
                    //check if agenda exists
                    const sqlCheckAgd=`select * from tbl_agenda where id=? AND event_id=?`;
                    const checkResult= await executeQuery(sqlCheckAgd,[agd.id,event_id]);
                    if(checkResult.length>0){
                        const sqlUpdate=`
                            UPDATE tbl_agenda 
                            SET title = ?, description = ?, start_time = ?, end_time = ? 
                            WHERE id = ? 
                        `;
                        await executeQuery(sqlUpdate,[agd.title, agd.description, agd.start_time, agd.end_time, agd.id]);
                    }else{
                        return res.status(404).json({ error: "Agenda not found", AgendaId: agd.id });
                    }
                }
            }

            //tbl_category 
            const sqlResetCategories=`DELETE FROM tbl_event_category WHERE event_id=?`;
            await executeQuery(sqlResetCategories, [event_id]);

            const sqlInsertCategories = ` 
                INSERT INTO tbl_event_category (event_id, category_id) VALUES (?, ?)
            `;
            for (const categoryId of event_categories) {
                await executeQuery(sqlInsertCategories, [event_id, categoryId]);
            }

            sendResponse(res, 200, true, "Event Updated successfully");

        } catch (error){
            handleResponseError(res, error);
    }
}

const deleteEvent= async(req,res)=>{
    let event_id=req.params.id;
    try {
        //check if evengt exist
        const sqlCheckEvent=`SELECT * FROM tbl_event WHERE id=?`;
        const result =await executeQuery(sqlCheckEvent, [event_id]);
        if(result.length===0){ //check if invalid event
            return sendResponse(res, 400, false, "Event is not found");
        }

        //execute delete event
        const sqlDeleteEvent=`DELETE FROM tbl_event WHERE id=?`;
        await executeQuery(sqlDeleteEvent,[event_id]);
        sendResponse(res, 200, true, "Event deleted successfully");

    } catch (error) {
        handleResponseError(res, error);
    }
}

const updateEThumbnail= async(req,res)=>{
    const event_id=req.params.id;
    try {
        // get old thumbnail 
        const sqlGetThumbnail = `
            SELECT thumbnail FROM tbl_event WHERE id = ?
        `;
        const dbTNResult = await executeQuery(sqlGetThumbnail, [event_id]);
        if (dbTNResult.length===0) {
            sendResponse(res, 404, false, "Event is not found");
        }
        const oldTN= dbTNResult[0].thumbnail;

        let file; // create variable to easy to access to db
        if(!req.files){
            file=oldTN; // if not update new file=> file=old file
        }
        else{
            let UploadFile=req.files.thumbnail;
            let UploadFileName=Date.now() + UploadFile.name;
            let uploadPath='./public/uploads/' + UploadFileName; 
            UploadFile.mv(uploadPath, (err)=> {
                if (err){
                    console.log(err);
                }
                if (oldTN && oldTN !== default_img) {
                    fs.unlinkSync('./public/uploads/'+oldTN); //remove old img when upload new img
                }
                // console.log('File uploaded!');
            });
            file = UploadFileName; // Set the new file name for database update    
        }
        const sqlUpdateThumbnail=`UPDATE tbl_event SET thumbnail=? WHERE id=?`;
        await executeQuery(sqlUpdateThumbnail,[file,event_id]);
        sendResponse(res, 200, true, "Event Thumbnail Update successfully");
    } catch (error) {
        handleResponseError(res,error);
    }
}

const deleteEThumbnail=async (req,res)=>{
    const event_id=req.params.id;

    try {
        //get old tn
        const sqlGetThumbnail = `
            SELECT thumbnail FROM tbl_event WHERE id = ?
        `;
        const dbTNResult = await executeQuery(sqlGetThumbnail, [event_id]);
        if (dbTNResult.length===0) {
            sendResponse(res, 404, false, "Event is not found");
        }
        const oldTN= dbTNResult[0].thumbnail;

        //remove old tn
        const oldPathimg='./public/uploads/'+ oldTN;
        if (fs.existsSync(oldPathimg) &&oldTN!==default_img) {
            fs.unlinkSync(oldPathimg); // Remove the old image
        }

        const sqlUpdateThumbnail=`UPDATE tbl_event SET thumbnail=? WHERE id=?`;
        await executeQuery(sqlUpdateThumbnail,[default_img,event_id]);
        sendResponse(res, 200, true, "Event Thumbnail delete successfully");
    } catch (error) {
        handleResponseError(res,error);
    }
}

const deleteEAgenda=async(req,res)=>{
    const agenda_id=req.params.id;
    try {
        //check if agenda exist
        const sqlCheckAgenda=`SELECT * FROM tbl_agenda WHERE id=?`;
        const result =await executeQuery(sqlCheckAgenda, [agenda_id]);
        if(result.length===0){ //check if invalid agenda
            return sendResponse(res, 400, false, `Agenda id ${agenda_id} is not found`);
        }
        //if exist, delete
        const sql=`DELETE FROM tbl_agenda WHERE id=?`;
        await executeQuery(sql,[agenda_id]);
        sendResponse(res, 200, true, `Event Agenda id "${agenda_id}" is delete successfully`);
    } catch (error) {
        handleResponseError(res,error);
    }
}

const deleteETickType=async(req,res)=>{
    const ticketType_id=req.params.id;
    try {
        //check if agenda exist
        const sqlCheckTicket=`SELECT * FROM tbl_ticketevent_type WHERE id=?`;
        const result =await executeQuery(sqlCheckTicket, [ticketType_id]);
        if(result.length===0){ //check if invalid ticket type to delete
            return sendResponse(res, 400, false, `Ticket Type id ${ticketType_id} is not found to delete`);
        }

        const sql=`DELETE FROM tbl_ticketevent_type WHERE id=?`;
        await executeQuery(sql,[ticketType_id]);
        sendResponse(res, 200, true, `Ticket Type id "${ticketType_id}" is delete successfully`);
    } catch (error) {
        handleResponseError(res,error);
    }
}

//post qr-img for payment
const uploadEQr=async(req,res)=>{
    const event_id=req.params.id;
    try {
        // get old qr 
        const sqlGetEvent = `
            SELECT * FROM tbl_event WHERE id = ?
        `;
        const dbResult = await executeQuery(sqlGetEvent, [event_id]);
        if (dbResult.length===0) {
            sendResponse(res, 404, false, "Event is not found");
        }
        const oldQr= dbResult[0].qr_img;
        let file; // create variable to easy to access to db
        if(!req.files){
            file=oldQr; // if not update new file=> file=old file
        }
        else{
            let UploadFile=req.files.qr_img;
            let UploadFileName=Date.now() + UploadFile.name;
            let uploadPath='./public/uploads/' + UploadFileName; 
            UploadFile.mv(uploadPath, (err)=> {
                if (err){
                    console.log(err);
                }
                const oldPathQr='./public/uploads/'+oldQr;
                if (fs.existsSync(oldPathQr)) {
                    fs.unlinkSync(oldPathQr); 
                }
                // console.log('File uploaded!');
            });
            file = UploadFileName; // Set the new file name for database update    
        }
        const sqlUpdateQr=`UPDATE tbl_event SET qr_img=? WHERE id=?`;
        await executeQuery(sqlUpdateQr,[file,event_id]);
        sendResponse(res, 200, true, "Event Qrganizer's Qr Update successfully");
        // const oldTN= dbQrResult[0].thumbnail;
    } catch (error) {
        handleResponseError(res,error);
    }
};

const deleteEQr=async (req,res)=>{
    const event_id=req.params.id;
    try {
        // get old qr 
        const sqlGetEvent = `
            SELECT * FROM tbl_event WHERE id = ?
        `;
        const dbResult = await executeQuery(sqlGetEvent, [event_id]);
        if (dbResult.length===0) {
            sendResponse(res, 404, false, "Event is not found");
        }
        // console.log("hello"+dbResult);
        const oldQr= dbResult[0].qr_img;

        //remove old tn
        const oldPathQr='./public/uploads/'+ oldQr;
        if (fs.existsSync(oldPathQr)) {
            fs.unlinkSync(oldPathQr); 
        }

        const sqlUpdateEQr=`UPDATE tbl_event SET qr_img=? WHERE id=?`;
        await executeQuery(sqlUpdateEQr,[null,event_id]);
        sendResponse(res, 200, true, "Event QR is delete successfully");
    } catch (error) {
        handleResponseError(res,error);
    }
}


module.exports={
    getAllEvent,
    putEditEvent,
    deleteEvent,
    postCreateEvent,
    getEventDetail,
    updateEThumbnail,
    deleteEThumbnail,
    deleteEAgenda,
    deleteETickType,
    uploadEQr,
    deleteEQr
}