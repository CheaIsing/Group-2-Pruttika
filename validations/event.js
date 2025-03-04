const Joi = require('joi');

//validate input event
const vCreateEvent = Joi.object({
    description: Joi.string()
        .required(),

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

const fileValidation = (fieldName) => {
    return Joi.object({
        [fieldName]: Joi.object().optional()
            .custom((value, helpers) => {
                if (!value) {
                    return value;// If the file does not exist, skip validation
                }

                // Validate file type
                const validExtensions = ['.jpg', '.jpeg', '.png'];
                const fileExtension = value.name.slice(((value.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();

                if (!validExtensions.includes('.' + fileExtension)) {
                    return helpers.message("Invalid file type. Only .jpg, .jpeg, .png are allowed.");
                }

                const maxSizeInMB = 3;
                const fileSizeInMB = value.size / (1024 * 1024); // Convert bytes to MB

                if (fileSizeInMB > maxSizeInMB) {
                    return helpers.message(`File size exceeds the limit of ${maxSizeInMB}MB.`);
                }

                return value; // Return the validated file
            }),
    });
};


module.exports={
    vCreateEvent,
    vAgendaSchema,
    fileValidation
}
