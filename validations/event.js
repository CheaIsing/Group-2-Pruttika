const Joi = require('joi');

// const vCreateEvent = Joi.object({
//     description:Joi.string().max(2000).required(),
//     started_date :Joi.string().required(),
//     ended_date :Joi.string().required(),
//     start_time :Joi.string().required(),
//     end_time :Joi.string().required(),
// }).options({ abortEarly: false ,allowUnknown: true});
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
    event_type: Joi.string().required(),
    event_categories:Joi.string().required(),
    is_published: Joi.number().required()
}).options({ abortEarly: false, allowUnknown: true });

module.exports={
    vCreateEvent
}