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
  rememberMe: Joi.boolean().required(),
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

const vProfileInfo = Joi.object({
  eng_name: Joi.string().trim().min(4).required().messages({
    "string.empty": "Username is required.",
    "string.min": "Username must be at least 4 characters.",
  }),
  kh_name: Joi.string().trim().optional().min(4).messages({
    "string.min": "Username must be at least 4 characters.",
  }),
  email: Joi.string()
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.pattern.base": "Invalid Email.",
    }),

  phone: Joi.string()
    .pattern(/^[0-9]{9,10}$/).allow('').optional()
    .messages({
      "string.pattern.base": "Phone number must be between 9 and 10 digits.",
    }),
    dob: Joi.date().max('now').allow('').optional().messages({
      "string.max": "Invalid Date of Birth.",
    }),
    address: Joi.string().allow('').optional(),
    gender: Joi.string().allow('').optional()
}).options({ abortEarly: false });

const vChangePass = Joi.object({
  oldPass: Joi.string().required().messages({
    "string.empty": "Old Password is required."
  }),
  newPass: Joi.string().required().messages({
    "string.empty": "New Password is required.",
  }),
  newPassConfirm: Joi.string()
    .valid(Joi.ref("newPass"))
    .required()
    .messages({
      "any.only": "Passwords not match.",
      "any.required": "Passwords not match.",
    }),
}).options({ abortEarly: false });

const vDeleteAcc = Joi.object({
  currentPass: Joi.string().required().messages({
    "string.empty": "Current Password is required to delete account."
  })
}).options({ abortEarly: false });