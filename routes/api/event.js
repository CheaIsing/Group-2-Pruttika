const express = require('express');

const {
    getAllEvent,
    postCreateEvent,
    putEditEvent,
    deleteEvent
}=require('../../controllers/api/event');

const { requireAuth } = require('../../middlewares/auth');

const router = express.Router();

router.get('/',getAllEvent);

router.post('/',postCreateEvent);

router.put('/info/:id',putEditEvent);

router.delete('/:id',deleteEvent);

module.exports=router;