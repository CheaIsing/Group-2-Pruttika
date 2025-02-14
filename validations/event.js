const Joi = require('joi');

//validate input event
const vCreateEvent = Joi.object({
    description: Joi.string()
        .max(2000)
        .required()
        .messages({
            'string.max': `"description" must be at most {2000} characters long`,
        }),
    started_date: Joi.string()
        .isoDate() // You can use isoDate for date validation
        .required(),
    ended_date: Joi.string()
        .isoDate() // Use isoDate if you expect a specific date format
        .required(),
    start_time: Joi.string()
        .pattern(/^\d{2}:\d{2}$/) // Validates time format HH:MM
        .required()
        .messages({
            'string.pattern.base': `"start_time" must be in the format HH:MM`,
        }),
    end_time: Joi.string()
        .pattern(/^\d{2}:\d{2}$/) // Validates time format HH:MM
        .required()
        .messages({
            'string.pattern.base': `"end_time" must be in the format HH:MM`,
        }),
    event_type: Joi.number().required(),
    event_categories:Joi.array().items(Joi.number()).required(),
    is_published: Joi.number().required()
}).options({ abortEarly: false, allowUnknown: true });

//validate input agenda
const vAgendaSchema = Joi.object({
    title: Joi.string().max(50).required().messages({
        'string.max': `"title" must be at most {50} characters long`,
    }),
    description: Joi.string().max(100).messages({
        'string.max': `"title" must be at most {100} characters long`,
    }),
    start_time: Joi.string()
        .pattern(/^\d{2}:\d{2}$/) // Validates time format HH:MM
        .required()
        .messages({
            'string.pattern.base': `"start_time" must be in the format HH:MM`,
        }),
    end_time: Joi.string()
        .pattern(/^\d{2}:\d{2}$/) // Validates time format HH:MM
        .required()
        .messages({
            'string.pattern.base': `"end_time" must be in the format HH:MM`,
        }),
}).options({ abortEarly: false, allowUnknown: true });



module.exports={
    vCreateEvent,
    vAgendaSchema
}
