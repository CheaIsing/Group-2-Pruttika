const express = require('express');

const {
    getAllEvent,
    postCreateEvent,
    putEditEvent,
    deleteEvent,
    getEventDetail,
    updateEThumbnail,
    deleteEThumbnail,
    deleteEAgenda,
    deleteETickType,
    uploadEQr,
    deleteEQr,
    putCheckIn,
    summaryData,
    getAllCheckInTicket
}=require('../../controllers/api/event');
const {checkEventOwner}=require('../../middlewares/event');
const { requireAuth,checkRole } = require('../../middlewares/auth');

const router = express.Router();

router.get('/',getAllEvent);
router.get('/:id',getEventDetail);
router.get('/summary-data/:id',requireAuth,checkEventOwner,summaryData);
router.get('/check-in-data/:id',requireAuth,checkEventOwner,getAllCheckInTicket);

router.post('/',requireAuth, checkRole(2),postCreateEvent);
router.post('/thumbnail/:id',requireAuth, checkEventOwner,updateEThumbnail);
router.post('/org-qr-img/:id',requireAuth, checkEventOwner,uploadEQr);

router.put('/info/:id',requireAuth, checkEventOwner,putEditEvent);
router.put('/check-in/',requireAuth,putCheckIn);

router.delete('/:id',requireAuth, checkEventOwner, deleteEvent);
router.delete('/thumbnail/:id',requireAuth, checkEventOwner, deleteEThumbnail);
router.delete('/agenda/:id',requireAuth, deleteEAgenda);
router.delete('/event-ticket-type/:id',requireAuth, deleteETickType);
router.delete('/org-qr-img/:id',requireAuth,checkEventOwner, deleteEQr);

module.exports=router;