const express = require('express');

const {
    postRequestTicket,
    updateTransactionFile,
    deleteTransactionFile,
    putApproveTicket,
    putRejectTicket,
    getAllRequestTicket,
}=require("../../controllers/api/ticket");
const { requireAuth,checkRole } = require('../../middlewares/auth');

const router = express.Router();

router.get('/request-ticket',requireAuth,checkRole(2),getAllRequestTicket);

router.post('/request-ticket',requireAuth,postRequestTicket);
router.post('/transaction-file/:id',requireAuth,updateTransactionFile);

router.put('/approve-req-ticket/:id',requireAuth,putApproveTicket);
router.put('/reject-req-ticket/:id',requireAuth,putRejectTicket);


router.delete('/transaction-file/:id',requireAuth,deleteTransactionFile);

module.exports=router;