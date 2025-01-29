const con=require('../../config/db');
const {vCreateEvent}=require("../../validations/event");
const {
    handleResponseError,
    handleValidateError,
  } = require("../../utils/handleError");
const { executeQuery } = require("../../utils/dbQuery");
const { sendResponse } = require("../../utils/response");
const {eventCollection}= require("../../resource/event");

const default_img="default-events-img.jpg";

const getAllEvent=async(req,res)=>{
    // const sqlgetEvent=`SELECT * FROM tbl_event`;
    // const result=await executeQuery(sqlInsertE, arrEvent);

    try {
        const data= await eventCollection();
        console.log("data :"+ data[0]);
        sendResponse(res, 200, true,"Get all event successfully", data);
    } catch (error) {
        handleResponseError(res, error);
    }
}

const postCreateEvent= async (req,res)=>{
    //validation
    const { error} = vCreateEvent.validate(req.body);
    if (handleValidateError(error, res)) return;

    // Iterate over the properties of req.body
    for (const key in req.body) {
        if (req.body[key] === "") {
            req.body[key] = null; // Set empty strings to null
        }
    }
    
    const {eng_name, kh_name, short_description, description,
        started_date, ended_date, start_time, end_time, location,event_type,
        event_categories,is_published,creator_id
    }=req.body;
    const categoriesArray = event_categories
        .match(/\d+/g) // Extracts all numbers from the string
        .map(Number); // Converts extracted strings to numbers
    // console.log(req.body);

    try {
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
            is_published,
            creator_id
        ];
        // await executeQuery(sqlInsertE,arrEvent);
        const result = await executeQuery(sqlInsertE, arrEvent);

        //get id from previous event 
        const event_id = result.insertId;

        const sqlInsertCategories="INSERT INTO `tbl_event_category`(`event_id`, `category_id`) VALUES (?,?)";
        for(i=0;i<categoriesArray.length;i++){
            await executeQuery(sqlInsertCategories, [event_id,categoriesArray[i]]);
        }
        sendResponse(res, 200, true, "Event created successfully");
    } catch (error){
        handleResponseError(res, error);
    }
}
const putEditEvent= async(req,res)=>{
    //validation
    const {error} = vCreateEvent.validate(req.body);
    if (handleValidateError(error, res)) return;

    // Iterate over the properties of req.body
    for (const key in req.body) {
        if (req.body[key] === "") {
            req.body[key] = null; // Set empty strings to null
        }
    }

    const {eng_name, kh_name, short_description, description,
        started_date, ended_date, start_time, end_time, location,event_type,
        event_categories,is_published
    }=req.body;
    let event_id=req.params.id;


    const categoriesArray = event_categories
        .match(/\d+/g) // Extracts all numbers from the string
        .map(Number); // Converts extracted strings to numbers
    
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

            const sqlResetCategories=`DELETE FROM tbl_event_category WHERE event_id=?`;
            await executeQuery(sqlResetCategories, [event_id]);

            const sqlInsertCategories="INSERT INTO `tbl_event_category`(`event_id`, `category_id`) VALUES (?,?)";
            for(i=0;i<categoriesArray.length;i++){
                await executeQuery(sqlInsertCategories, [event_id,categoriesArray[i]]);
            }

            sendResponse(res, 200, true, "Event Updated successfully");

        } catch (error){
            handleResponseError(res, error);
    }
}

const deleteEvent= async(req,res)=>{
    let event_id=req.params.id;
    console.log(event_id);
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

module.exports={
    getAllEvent,
    postCreateEvent,
    putEditEvent,
    deleteEvent
}