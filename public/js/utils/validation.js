const Joi = joi;

const vSignIn = Joi.object({
  email: Joi.string()
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.pattern.base": "Invalid Email.",
    }),
  password: Joi.string().min(6).trim().required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters.",
  }),
}).options({ abortEarly: false });

const vSignUp = Joi.object({
  name: Joi.string().trim().min(4).required().messages({
    "string.empty": "Username is required.",
    "string.min": "Username must be at least 4 characters.",
  }),
  email: Joi.string()
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.pattern.base": "Invalid Email.",
    }),
  password: Joi.string().min(6).trim().required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters.",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Password and Confirm Password must match.",
    "any.required": "Password and Confirm Password must match.",
  }),
}).options({ abortEarly: false });
