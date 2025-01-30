const { executeQuery }=require('../utils/dbQuery');

const eventCollection= async()=>{
    try {
        const result=await executeQuery("SELECT * from tbl_event ",);
        return result;

    } catch (error) {
        
    }
}

module.exports={
    eventCollection
}