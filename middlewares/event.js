const {sendResponse}=require('../utils/response');
const {executeQuery}=require("../utils/dbQuery");

const checkOrganizer=async (req,res,next)=>{
    const user_id=req.user.id;
    if(!user_id){
        return sendResponse(res, 400, false, "User not authenticated.");

    }
    const checkOrg=await executeQuery("Select * from tbl_organizer where user_id=?",user_id);
    if(checkOrg.length===0){
        return sendResponse(res, 403, false, "Access denied! User must be an organizer!");
    }
    next();
}

const checkEventOwner = async (req, res, next) => {
    const event_id = req.params.id;
    const user_id = req.user.id; // Assuming user ID is stored in req.user after authentication
    try {
        const sqlGetOwner = `SELECT creator_id FROM tbl_event WHERE id = ?`;

        const ownerResult = await executeQuery(sqlGetOwner, [event_id]);

        if (ownerResult.length === 0) {
            return sendResponse(res, 404, false, "Event not found");
        }

        const owner_id = ownerResult[0].creator_id;

        // Check if the user is the owner
        if (owner_id !== user_id) {
            return sendResponse(res, 403, false, "You do not have permission to modify this event.");
        }

        next();

    } catch (error) {
        console.error("Error in checkEventOwner:", error);
        return sendResponse(res, 500, false, "An error occurred while checking event ownerevent.");
    }
};

module.exports={
    checkOrganizer,
    checkEventOwner
}