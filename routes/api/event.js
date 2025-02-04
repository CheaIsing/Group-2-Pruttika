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
    deleteEQr
}=require('../../controllers/api/event');
const {checkOrganizer, checkEventOwner}=require('../../middlewares/event')

const { requireAuth } = require('../../middlewares/auth');

const router = express.Router();

router.get('/',getAllEvent);
router.get('/:id',getEventDetail);

router.post('/',requireAuth, checkOrganizer,postCreateEvent);
router.post('/thumbnail/:id',requireAuth, checkEventOwner,updateEThumbnail);
router.post('/org-qr-img/:id',requireAuth, checkEventOwner,uploadEQr);
// router.post('/create-event',requireAuth,checkOrganizer,CreateEvent);

router.put('/info/:id',requireAuth, checkEventOwner,putEditEvent);

router.delete('/:id',requireAuth, checkEventOwner, deleteEvent);
router.delete('/thumbnail/:id',requireAuth, checkEventOwner, deleteEThumbnail);
router.delete('/agenda/:id',requireAuth, checkEventOwner, deleteEAgenda);
router.delete('/event-ticket-type/:id',requireAuth, checkEventOwner, deleteETickType);
router.delete('/org-qr-img/:id',requireAuth, checkEventOwner, deleteEQr);

module.exports=router;