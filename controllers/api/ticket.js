const fs=require('fs');
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');
const {
    handleResponseError,handleValidateError} = require("../../utils/handleError");
const { executeQuery } = require("../../utils/dbQuery");
const {sendResponse ,sendResponse1}= require("../../utils/response");
const {reqTicketCollection}=require("../../resource/ticket");
const {fileValidation}=require("../../validations/event");
const { generateQRCodeImg } = require('../../utils/generateQrImg');
const { emitTicketApprovalNotification, emitTicketRejectNotification } = require('../../socket/socketHelper');

// const QRCode = require('qrcode');
const generateToken= (id,ticket_type,event_id) => {
    return jwt.sign({
        ticket_id:id,
        ticket_type_id : ticket_type,
        event_id : event_id
    },process.env.SECRET,{}); 
}

const postRequestTicket=async(req,res)=>{
    const {
        ticket_type_id,
        quantity,
        event_id
    }=req.body;
    const buyer_id=req.user.id;

    try {
        //check if ticket is online or offline
        const eventDetails = await executeQuery(`SELECT event_type FROM tbl_event WHERE id = ?`, [event_id]);
        // console.log(eventDetails[0].event_type);

        if (eventDetails[0].event_type==1) {
            // For online events, no ticket_type_id and quantity validation needed
            const sqlInsertReq = `INSERT INTO tbl_transaction(buyer_id, event_id, ticket_qty, total_amount) VALUES(?,?,?,?)`;
            const totalAmount = 0;
            await executeQuery(sqlInsertReq, [buyer_id, event_id, 1, totalAmount]);
            return sendResponse(res, 200, true, `Request for online event successfully created.`);
        }else if(eventDetails[0].event_type==2){
            //validation
            const ticketTypeId=Number(ticket_type_id);
            const qty=Number(quantity);
            if (!ticketTypeId || isNaN(ticketTypeId) || !Number.isInteger(ticketTypeId)) {
                return sendResponse(res, 400, false, "Ticket type ID is required for offline events.");
            }

            if (!qty ||isNaN(ticketTypeId) || !Number.isInteger(ticketTypeId) || qty < 0) {
                return sendResponse(res, 400, false, "Quantity must be a positive number.");
            }

            //check ticket
            const sqlCheckTicket=`SELECT * FROM tbl_ticketevent_type WHERE id=?`;
            const cTicket=await executeQuery(sqlCheckTicket,[ticketTypeId]);
            const checkTicket=cTicket[0];

            if(!checkTicket ){
                return sendResponse(res,400,false,`Event Ticket Type id ${ticketTypeId} is not found`);
            }
            if((checkTicket.ticket_bought+qty) > checkTicket.ticket_opacity){
                return sendResponse(res,400,false,`This tickets are sold out or the number of tickets you requested exceeds the remaining availability.`);
            }
            const amount=checkTicket.price*qty;
            const sqlInsertReq=`INSERT INTO tbl_transaction(buyer_id, ticket_event_id, ticket_qty, total_amount,event_id) VALUES(?,?,?,?,?)`;
            const result = await executeQuery(sqlInsertReq,[buyer_id, ticketTypeId, qty, amount,event_id]);
            sendResponse(res,200,true,`Request Ticket Successfully`, result);
        }
    } catch (error) {
        // console.log(error);
        handleResponseError(res,error);
    }
}

const updateTransactionFile=async(req,res)=>{
    const ticketReq_id=req.params.id;
    
    // Validate file
    const fileSchema = fileValidation('transaction_file');
    const { error } = fileSchema.validate({ transaction_file: req.files ? req.files.transaction_file : undefined });
    if (handleValidateError(error, res)) return;

    try {
        const sqlGetTransaction = `
            SELECT * FROM tbl_transaction WHERE id = ?
        `;
        const dbResult = await executeQuery(sqlGetTransaction, [ticketReq_id]);
        if (dbResult.length===0) {
            return sendResponse(res, 404, false, "Ticket Request ID is not found");
        }
        const oldTransaction= dbResult[0].transaction_img;

        let file; 
        if(!req.files){
            file=oldTransaction; 
        }
        else{
            let UploadFile=req.files.transaction_file;
            let UploadFileName=Date.now() + UploadFile.name;
            let uploadPath='./public/uploads/transaction/' + UploadFileName; 
            UploadFile.mv(uploadPath, (err)=> {
                if (err){
                    // console.log(err);
                }
                const oldPathTran='./public/uploads/transaction/'+oldTransaction;
                if (fs.existsSync(oldPathTran)) {
                    fs.unlinkSync(oldPathTran); 
                }
            });
            file = UploadFileName; // Set the new file name for database update    
        }

        const sqlUpdateTransaction=`UPDATE tbl_transaction SET transaction_img=? WHERE id=?`;
        await executeQuery(sqlUpdateTransaction,[file,ticketReq_id]);
        sendResponse(res, 200, true, "Transaction file Update successfully");
    } catch (error) {
        handleResponseError(res,error);
    }
};

const deleteTransactionFile=async (req,res)=>{
    const ticketReq_id=req.params.id;
    try {
        const sqlGetTransaction = `
            SELECT * FROM tbl_transaction WHERE id = ?
        `;
        const dbResult = await executeQuery(sqlGetTransaction, [ticketReq_id]);
        if (dbResult.length===0) {
            return sendResponse(res, 404, false, "Ticket Request ID is not found");
        }
        const oldTrans= dbResult[0].transaction_img;

        //remove old transaction
        const oldPathTran='./public/uploads/transaction/'+ oldTrans;
        if (fs.existsSync(oldPathTran)) {
            fs.unlinkSync(oldPathTran); 
        }

        const sqlUpdateTransaction=`UPDATE tbl_transaction SET transaction_img=? WHERE id=?`;
        await executeQuery(sqlUpdateTransaction,[null,ticketReq_id]);
        sendResponse(res, 200, true, "Transaction File of Ticket Request is delete successfully");
    } catch (error) {
        handleResponseError(res,error);
    }
}

//approve ticket
const putApproveTicket = async (req, res) => {
    const ticketReq_id = req.params.id;
    const user_id = req.user.id;

    try {
        const sqlGetTransaction = `
            SELECT 
                tts.id,
                tts.ticket_event_id,
                tts.ticket_qty,
                tts.event_id,
                tts.buyer_id,
                te.event_type,
                te.eng_name
            FROM tbl_transaction tts
            LEFT JOIN tbl_event te ON te.id=tts.event_id
            WHERE tts.id = ? AND te.creator_id=?
        `;

        const dbResult = await executeQuery(sqlGetTransaction, [ticketReq_id, user_id]);


        if (dbResult.length === 0) {
            return sendResponse(res, 404, false, "Ticket Request ID not found or You do not have permission to Approved this ticket");
        }

        const {
            id,
            ticket_qty,
            ticket_event_id,
            event_id,
            event_type,
            buyer_id,
            eng_name
        } = dbResult[0];


        const checkApprove = await executeQuery(`select * from tbl_transaction where id=? AND status=?`, [ticketReq_id, 2]);

        if (checkApprove.length > 0) {
            return sendResponse(res, 400, false, "This Request is already have been Approved!");
        }

        if (event_type == 2) { //offline

            const checkAvailableTicket = await executeQuery(`
                select * from tbl_ticketevent_type 
                where id=? AND ticket_bought <= (ticket_opacity - ?)
            `, [ticket_event_id, ticket_qty]);


            if (checkAvailableTicket.length === 0) {
                return sendResponse(res, 400, false, "Not enough tickets available!");
            }
            const ticket_bought = checkAvailableTicket[0].ticket_bought;

            const sqlInsertTicket = `INSERT INTO tbl_ticket(transaction_id,ticket_event_id) VALUES(?,?)`;
            const promises =[];
            for (let i = 0; i < ticket_qty; i++) {
                promises.push(
                    (async () => {
                        try {
                            const resultInsert = await executeQuery(sqlInsertTicket, [ticketReq_id, ticket_event_id]);

                        const ticket_id = resultInsert.insertId;
                        const token = await generateToken(ticket_id, ticket_event_id, event_id);

                        const qr_code_img = await generateQRCodeImg(token);

                        await executeQuery(`UPDATE tbl_ticket SET qr_code = ?, qr_code_img = ? WHERE id = ?`, [token, qr_code_img, ticket_id]);
                        } catch (error) {
                            // console.log(error);
                            handleResponseError(res, error);
                        }
                        
                    })()
                );
            }


            const sqlInsertNotification1 = `INSERT INTO tbl_notification
                (event_id, receiver_id, eng_message,kh_message,sender_id,ticket_req_id, type_id) 
                VALUES (?,?,?,?,?,?,?)`;
            const paramsNotification1 = [
                event_id,
                buyer_id,
                `Congratulations! Your ticket for ${eng_name} has been successfully approved. Enjoy the event! Check your details here.`,
                `អបអរសាទរ! សំបុត្ររបស់អ្នកសម្រាប់កម្មវិធី ${eng_name} ត្រូវបានអនុម័តដោយជោគជ័យ។ សូមរីករាយជាមួយព្រឹត្តិការណ៍នេះ! ពិនិត្យព័ត៌មានលម្អិតរបស់អ្នកនៅទីនេះ។`,
                user_id,
                id,
                1
            ];
            await executeQuery(sqlInsertNotification1, paramsNotification1);

            await Promise.all(promises);

            await executeQuery(`UPDATE tbl_ticketevent_type SET ticket_bought=? WHERE id=?`, [ticket_bought + ticket_qty, ticket_event_id]);

        } else if (event_type == 1) {
            const sqlInsertNotification2 = `INSERT INTO tbl_notification
                (event_id, receiver_id, eng_message,kh_message,sender_id,ticket_req_id, type_id) 
                VALUES (?,?,?,?,?,?,?)`;
            const paramsNotification2 = [
                event_id,
                buyer_id,
                `Congratulations! Your registration for the event ${eng_name} has been approved. Please wait until the event day, as the organizer will send the link to join the event through a notification.`,
                `អបអរសាទរ! ការចុះឈ្មោះរបស់អ្នកសម្រាប់ព្រឹត្តិការណ៍ ${eng_name} នេះត្រូវបានអនុម័តជោគជ័យ។ សូមរង់ចាំរហូតដល់ថ្ងៃព្រឹត្តិការណ៍មកដល់ ព្រោះអ្នករៀបចំនឹងផ្ញើតំណភ្ជាប់ដើម្បីចូលរួមកម្មវិធីតាមរយៈការជូនដំណឹង។`,
                user_id,
                id,
                1
            ];
            await executeQuery(sqlInsertNotification2, paramsNotification2);
        }

        await executeQuery(`UPDATE tbl_transaction SET status = ? WHERE id = ?`, [2, ticketReq_id]);

        const io = req.app.get('io');
        emitTicketApprovalNotification(io, buyer_id, event_id, eng_name, event_type);

        sendResponse(res, 200, true, "Ticket Request has been approved successfully");

    } catch (error) {
        // console.error("putApproveTicket - Error:", error);
        handleResponseError(res, error);
    }
}

//rejected ticket
const putRejectTicket=async(req,res)=>{
    const ticketReq_id=req.params.id;
    const user_id=req.user.id;
    const{
        rejected_reason
    }=req.body;
    if(!rejected_reason || rejected_reason.trim().length===0){
        return sendResponse(res,404,false, " You must need to input the reason why the ticket got rejected!");
    }
    try {
        const sqlGetTransaction = `
            SELECT 
                tts.id,
                tts.status,
                tts.buyer_id,
                tts.event_id,
                te.eng_name
            FROM tbl_transaction tts
            LEFT JOIN tbl_event te ON te.id=tts.event_id
            WHERE tts.id = ? AND te.creator_id=?
        `;
        const dbResult = await executeQuery(sqlGetTransaction, [ticketReq_id,user_id]);

        //check if transaction exist
        if (dbResult.length===0) {
            return sendResponse(res, 404, false, "Ticket Request ID not found or You do not have permission to Reject this ticket");
        }

        const {
            id,
            status,
            event_id,
            buyer_id,
            eng_name
        }=dbResult[0];

        
        // Check if the ticket request is already rejected or approved
        if (dbResult[0].status === 3) {
            return sendResponse(res, 400, false, "This Ticket Request has already been rejected.");
        } else if (dbResult[0].status === 2) {
            return sendResponse(res, 400, false, "Cannot reject an approved Ticket Request.");
        }

        const sqlUpdateTransaction=`UPDATE tbl_transaction SET status = ? ,rejection_reason=? WHERE id = ?`;
        
        // Update transaction status to approved 
        await executeQuery(sqlUpdateTransaction, [3,rejected_reason, ticketReq_id]);

        //insert notification
        const sqlInsertNotification2=`INSERT INTO tbl_notification
                    (event_id, receiver_id, eng_message,kh_message,sender_id,ticket_req_id, type_id) 
                    VALUES (?,?,?,?,?,?,?)`
                    
        const paramsNotification2=[
            event_id,
            buyer_id,
            `Unfortunately, your request for a ticket to event ${eng_name} has been denied. Reason: ${rejected_reason}. We appreciate your understanding.`,
            `គួរឲ្យសោកស្ដាយណាស់ សំណើរបស់អ្នកសម្រាប់សំបុត្រចូលរួមកម្មវិធី ${eng_name} ត្រូវបានបដិសេធ។ ហេតុផល៖ ${rejected_reason} ។ យើងសូមកោតសរសើរចំពោះការយោគយល់របស់អ្នក។`,
            user_id,
            id,
            2
        ];
        await executeQuery(sqlInsertNotification2,paramsNotification2);

        const io = req.app.get('io');

        emitTicketRejectNotification(io, buyer_id, event_id, eng_name, rejected_reason)

        sendResponse(res,200,true,`Ticket Request ID ${ticketReq_id} has been rejected successfully`);
    } catch (error) {
        // console.log(error);
        handleResponseError(res,error);
    }
}

//get all ticket for organizer
const getAllRequestTicket=async(req,res)=>{
    const user_id=req.user.id;
    try {
        const data=await reqTicketCollection(
            user_id,
            req.query.event_id , req.query.ticket_type_id,
            req.query.status,
            req.query.page, req.query.per_page,
            req.query.sort, req.query.order, req.query.search
        );
        sendResponse1(res,200,true,"Get all user request ticket successfully",data.rows,data.paginate)
    } catch (error) {
        handleResponseError(res,error);
    }
}


module.exports={
    postRequestTicket,
    updateTransactionFile,
    deleteTransactionFile,
    putApproveTicket,
    putRejectTicket,
    getAllRequestTicket
}