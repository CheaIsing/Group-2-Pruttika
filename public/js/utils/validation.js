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
  eng_name: Joi.string().trim().min(4).required().messages({
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
    "any.only": "Password must match.",
    "any.required": "Password must match.",
  }),
}).options({ abortEarly: false });

const vForgotPassword = Joi.object({
  email: Joi.string()
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.pattern.base": "Invalid Email.",
    }),
}).options({ abortEarly: false });

const vVerifyOtp = Joi.object({
  verifyOtp: Joi.string()
    .trim()
    .required()
    .pattern(/^\d{6}$/) 
    .messages({
      "string.empty": "Otp Code is required.",
      "string.pattern.base": "Otp Code must be exactly 6 digits.",
    }),
}).options({ abortEarly: false });

const vResetPass = Joi.object({
  newPassword: Joi.string().min(6).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters.",
  }),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords must match.",
    "any.required": "Passwords must match.",
    }),
}).options({ abortEarly: false });