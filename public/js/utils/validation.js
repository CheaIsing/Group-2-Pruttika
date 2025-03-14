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
  kh_name: Joi.string().trim().allow("").optional().min(4).messages({
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
    .pattern(/^[0-9]{9,10}$/)
    .allow("")
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be between 9 and 10 digits.",
    }),
  dob: Joi.date().max("now").allow("").optional().messages({
    "string.max": "Invalid Date of Birth.",
  }),
  address: Joi.string().allow("").optional(),
  gender: Joi.string().allow("").optional(),
}).options({ abortEarly: false });

const vChangePass = Joi.object({
  oldPass: Joi.string().required().messages({
    "string.empty": "Old Password is required.",
  }),
  newPass: Joi.string().required().messages({
    "string.empty": "New Password is required.",
  }),
  newPassConfirm: Joi.string().valid(Joi.ref("newPass")).required().messages({
    "any.only": "Passwords not match.",
    "any.required": "Passwords not match.",
  }),
}).options({ abortEarly: false });

const vDeleteAcc = Joi.object({
  currentPass: Joi.string().required().messages({
    "string.empty": "Current Password is required to delete account.",
  }),
}).options({ abortEarly: false });

const vOrganizerRequest = Joi.object({
  organization_name: Joi.string().trim().min(4).required().messages({
    "string.empty": "Organization Name is required.",
    "string.min": "Organization Name must be at least 4 characters.",
  }),
  business_email: Joi.string()
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.pattern.base": "Invalid Email.",
    }),
  bio: Joi.string().trim().allow("").optional(),
  location: Joi.string().trim().required().messages({
    "string.empty": "Location is required.",
  }),
  facebook: Joi.string().trim().required().messages({
    "string.empty": "Facebook is required.",
  }),
  telegram: Joi.string().allow("").optional(),
  tiktok: Joi.string().allow("").optional(),
  linkin: Joi.string().allow("").optional(),
  business_phone: Joi.string()
    .trim()
    .required()
    .pattern(/^[0-9]{9,10}$/)
    .messages({
      "string.pattern.base": "Phone number must be between 9 and 10 digits.",
      "string.empty": "Phone number is required.",
    }),
}).options({ abortEarly: false });

const vEventOverview = Joi.object({
  eng_name: Joi.string().trim().min(6).required().messages({
    "string.empty": "Event title is required.",
    "string.min": "Event title must be at least 6 characters.",
  }),
  event_type: Joi.string().valid("1", "2").required().messages({
    "any.only": "Invalid event type selected.",
  }),
  event_categories: Joi.array().min(1).items(Joi.string()).required().messages({
    "array.min": "Please select at least one category.",
  }),
}).options({ abortEarly: false });

const vEventDateAndLocation = Joi.object({
  started_date: Joi.string().trim().required().messages({
    "string.empty": "Start date is required.",
  }),
  ended_date: Joi.string().trim().required().messages({
    "string.empty": "End date is required.",
  }),
  start_time: Joi.string().trim().required().messages({
    "string.empty": "Start time is required.",
  }),
  end_time: Joi.string().trim().required().messages({
    "string.empty": "End time is required.",
  }),
  location: Joi.string().trim().required().messages({
    "string.empty": "Location is required.",
  }),
}).options({ abortEarly: false });

const vEventDateOnline = Joi.object({
  started_date: Joi.string().trim().required().messages({
    "string.empty": "Start date is required.",
  }),
  ended_date: Joi.string().trim().required().messages({
    "string.empty": "End date is required.",
  }),
  start_time: Joi.string().trim().required().messages({
    "string.empty": "Start time is required.",
  }),
  end_time: Joi.string().trim().required().messages({
    "string.empty": "End time is required.",
  }),
  location: Joi.string().trim().allow("").optional().messages({
    "string.empty": "Location is required.",
  }),
}).options({ abortEarly: false });

const vEventDescription = Joi.object({
  short_description: Joi.string().trim().required().messages({
    "string.empty": "Short Description is required.",
  }),
  description: Joi.string().trim().required().messages({
    "string.empty": "Description Detail is required.",
  }),
}).options({ abortEarly: false });

const vEventAgenda = Joi.object({
  title: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Title is required.",
    "string.min": "Title must be at least 3 characters.",
    "string.max": `Title must be at most {50} characters long`,
  }),
  description: Joi.string().trim().min(5).max(100).required().messages({
    "string.empty": "Description is required.",
    "string.min": "Description must be at least 5 characters.",
    "string.max": `Title must be at most 100 characters long`,
  }),
  start_time: Joi.string().trim().required().messages({
    "string.empty": "Start time is required.",
  }),
  end_time: Joi.string().trim().required().messages({
    "string.empty": "End time is required.",
  }),
}).options({ abortEarly: false });

const vUpdateEventAgenda = Joi.object({
  id: Joi.alternatives().try(
    Joi.number().integer().min(0),  // or just Joi.number().integer() if negative is allowed
    Joi.string().valid('')
  ),
  title: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Title is required.",
    "string.min": "Title must be at least 3 characters.",
    "string.max": `Title must be at most {50} characters long`,
  }),
  description: Joi.string().trim().min(5).max(100).required().messages({
    "string.empty": "Description is required.",
    "string.min": "Description must be at least 5 characters.",
    "string.max": `Title must be at most 100 characters long`,
  }),
  start_time: Joi.string().trim().required().messages({
    "string.empty": "Start time is required.",
  }),
  end_time: Joi.string().trim().required().messages({
    "string.empty": "End time is required.",
  }),
}).options({ abortEarly: false });

const vEventTickets = Joi.object({
  type: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Ticket type is required.",
    "string.min": "Ticket type must be at least 3 characters.",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Ticket price must be a number.",
    "number.min": "Ticket price cannot be negative.",
    "any.required": "Ticket price is required.",
  }),
  ticket_opacity: Joi.number().integer().min(1).required().messages({
    "number.base": "Ticket capacity must be a number.",
    "number.integer": "Ticket capacity must be an integer.",
    "number.min": "Ticket capacity must be at least 1.",
    "any.required": "Ticket capacity is required.",
  }),
}).options({ abortEarly: false });

const vUpdateEventTickets = Joi.object({
  id: Joi.alternatives().try(
    Joi.number().integer().min(0),  // or just Joi.number().integer() if negative is allowed
    Joi.string().valid('')
  ),
  type: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Ticket type is required.",
    "string.min": "Ticket type must be at least 3 characters.",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Ticket price must be a number.",
    "number.min": "Ticket price cannot be negative.",
    "any.required": "Ticket price is required.",
  }),
  ticket_opacity: Joi.number().integer().min(1).required().messages({
    "number.base": "Ticket capacity must be a number.",
    "number.integer": "Ticket capacity must be an integer.",
    "number.min": "Ticket capacity must be at least 1.",
    "any.required": "Ticket capacity is required.",
  }),
}).options({ abortEarly: false });

const validateFile = (file, maxSizeMB = 3) => {
  if (!file) {
    return { valid: false, message: 'Invalid file type. Only JPG, JPEG, PNG are allowed.' }; // No file, validation passes
  }

  const validExtensions = ['.jpg', '.jpeg', '.png'];
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));

  if (!(validExtensions.includes(fileExtension))) {
    return {
      valid: false,
      message: 'Invalid file type. Only JPG, JPEG, PNG are allowed.',
    };
  }

  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      message: `File size exceeds the limit of ${maxSizeMB}MB.`,
    };
  }

  return { valid: true }; // All validations passed
};

const validateFileQR = (file, maxSizeMB = 3) => {
  if (!file) {
    return { valid: false, message: 'Payment Qr Image is required.' }; // No file, validation passes
  }

  const validExtensions = ['.jpg', '.jpeg', '.png'];
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
  // console.log(file);
  // console.log(fileExtension);
  
  if (!(validExtensions.includes(fileExtension))) {
    return {
      valid: false,
      message: 'Invalid file type. Only JPG, JPEG, PNG are allowed.',
    };
  }

  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      message: `File size exceeds the limit of ${maxSizeMB}MB.`,
    };
  }

  return { valid: true }; // All validations passed
};