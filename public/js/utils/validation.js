


const Joi = joi; // Change this to false for Khmer messages

const messages = {
  emailRequired: isEnglish ? "Email is required." : "អ៊ីមែល ត្រូវបានទាមទារ។",
  emailInvalid: isEnglish ? "Invalid Email." : "អ៊ីមែលមិនត្រឹមត្រូវ។",
  passwordRequired: isEnglish ? "Password is required." : "ពាក្យសម្ងាត់ ត្រូវបានទាមទារ។",
  passwordMin: isEnglish ? "Password must be at least 6 characters." : "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 6 តួអក្សរ។",
  otpRequired: isEnglish ? "Otp Code is required." : "កូដ OTP ត្រូវបានទាមទារ។",
  otpInvalid: isEnglish ? "Otp Code must be exactly 6 digits." : "កូដ OTP ត្រូវតែមាន 6 ខ្ទង់។",
  usernameRequired: isEnglish ? "Username is required." : "ឈ្មោះអ្នកប្រើ ត្រូវបានទាមទារ។",
  usernameMin: isEnglish ? "Username must be at least 4 characters." : "ឈ្មោះអ្នកប្រើត្រូវមានយ៉ាងហោចណាស់ 4 តួអក្សរ។",
  passwordsMatch: isEnglish ? "Passwords must match." : "ពាក្យសម្ងាត់ត្រូវតែត្រួតពិនិត្យគ្នា។",
  currentPassRequired: isEnglish ? "Current Password is required to delete account." : "ពាក្យសម្ងាត់​បច្ចុប្បន្ន​ត្រូវបានទាមទារ​សម្រាប់លុបគណនី។",
  organizationNameRequired: isEnglish ? "Organization Name is required." : "ឈ្មោះអង្គការត្រូវបានទាមទារ។",
  locationRequired: isEnglish ? "Location is required." : "ទីតាំងត្រូវបានទាមទារ។",
  facebookRequired: isEnglish ? "Facebook is required." : "Facebook ត្រូវបានទាមទារ។",
  phoneNumberRequired: isEnglish ? "Phone number is required." : "លេខទូរស័ព្ទ ត្រូវបានទាមទារ។",
  phoneNumberInvalid: isEnglish ? "Phone number must be between 9 and 10 digits." : "លេខទូរស័ព្ទត្រូវតែមានចន្លោះពី 9 ទៅ 10 ខ្ទង់។",
  startDateRequired: isEnglish ? "Start date is required." : "កាលបរិច្ឆេទចាប់ផ្តើមត្រូវបានទាមទារ។",
  endDateRequired: isEnglish ? "End date is required." : "កាលបរិច្ឆេទបញ្ចប់ត្រូវបានទាមទារ។",
  startTimeRequired: isEnglish ? "Start time is required." : "ម៉ោងចាប់ផ្តើមត្រូវបានទាមទារ។",
  endTimeRequired: isEnglish ? "End time is required." : "ម៉ោងបញ្ចប់ត្រូវបានទាមទារ។",
  shortDescriptionRequired: isEnglish ? "Short Description is required." : "ការពិពណ៌នាខ្លី ត្រូវបានទាមទារ។",
  descriptionRequired: isEnglish ? "Description Detail is required." : "ព័ត៌មានពិពណ៌នាដែលលម្អិត ត្រូវបានទាមទារ។",
  ticketTypeRequired: isEnglish ? "Ticket type is required." : "ប្រភេទសំបុត្រត្រូវបានទាមទារ។",
  ticketPriceRequired: isEnglish ? "Ticket price is required." : "តម្លៃសំបុត្រត្រូវបានទាមទារ។",
  ticketCapacityRequired: isEnglish ? "Ticket capacity is required." : "សមត្ថភាពសំបុត្រត្រូវបានទាមទារ។",
  ticketCapacityMin: isEnglish ? "Ticket capacity must be at least 1." : "សមត្ថភាពសំបុត្រត្រូវតែមានយ៉ាងហោចណាស់ 1។",
  fileTypeInvalid: isEnglish ? "Invalid file type. Only JPG, JPEG, PNG are allowed." : "ប្រភេទឯកសារមិនត្រឹមត្រូវ។ អនុញ្ញាតឱ្យមានតែ JPG, JPEG, PNG ប៉ុណ្ណោះ។",
  fileSizeExceeded: (maxSizeMB) => isEnglish 
    ? `File size exceeds the limit of ${maxSizeMB}MB.` 
    : `ទំហំឯកសារប្រហែលលើកំណត់ ${maxSizeMB}MB។`,
};

const vSignIn = Joi.object({
  email: Joi.string()
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
    .required()
    .messages({
      "string.empty": messages.emailRequired,
      "string.pattern.base": messages.emailInvalid,
    }),
  password: Joi.string().min(6).trim().required().messages({
    "string.empty": messages.passwordRequired,
    "string.min": messages.passwordMin,
  }),
  rememberMe: Joi.boolean().required(),
}).options({ abortEarly: false });

const vSignUp = Joi.object({
  name: Joi.string().trim().min(4).required().messages({
    "string.empty": messages.usernameRequired,
    "string.min": messages.usernameMin,
  }),
  email: Joi.string()
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
    .required()
    .messages({
      "string.empty": messages.emailRequired,
      "string.pattern.base": messages.emailInvalid,
    }),
  password: Joi.string().min(6).trim().required().messages({
    "string.empty": messages.passwordRequired,
    "string.min": messages.passwordMin,
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": messages.passwordsMatch,
    "any.required": messages.passwordsMatch,
  }),
}).options({ abortEarly: false });

const vForgotPassword = Joi.object({
  email: Joi.string()
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
    .required()
    .messages({
      "string.empty": messages.emailRequired,
      "string.pattern.base": messages.emailInvalid,
    }),
}).options({ abortEarly: false });

const vVerifyOtp = Joi.object({
  verifyOtp: Joi.string()
    .trim()
    .required()
    .pattern(/^\d{6}$/)
    .messages({
      "string.empty": messages.otpRequired,
      "string.pattern.base": messages.otpInvalid,
    }),
}).options({ abortEarly: false });

const vResetPass = Joi.object({
  newPassword: Joi.string().min(6).required().messages({
    "string.empty": messages.passwordRequired,
    "string.min": messages.passwordMin,
  }),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": messages.passwordsMatch,
      "any.required": messages.passwordsMatch,
    }),
}).options({ abortEarly: false });

const vProfileInfo = Joi.object({
  eng_name: Joi.string().trim().min(4).required().messages({
    "string.empty": messages.usernameRequired,
    "string.min": messages.usernameMin,
  }),
  kh_name: Joi.string().trim().allow("").optional().min(4).messages({
    "string.min": messages.usernameMin,
  }),
  email: Joi.string()
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
    .required()
    .messages({
      "string.empty": messages.emailRequired,
      "string.pattern.base": messages.emailInvalid,
    }),
  phone: Joi.string()
    .pattern(/^[0-9]{9,10}$/)
    .allow("")
    .optional()
    .messages({
      "string.pattern.base": messages.phoneNumberInvalid,
    }),
  dob: Joi.date().max("now").allow("").optional().messages({
    "string.max": "Invalid Date of Birth.", // Adjust this message as needed
  }),
  address: Joi.string().allow("").optional(),
  gender: Joi.string().allow("").optional(),
}).options({ abortEarly: false });

const vChangePass = Joi.object({
  oldPass: Joi.string().required().messages({
    "string.empty": messages.currentPassRequired,
  }),
  newPass: Joi.string().required().messages({
    "string.empty": messages.passwordRequired,
  }),
  newPassConfirm: Joi.string().valid(Joi.ref("newPass")).required().messages({
    "any.only": messages.passwordsMatch,
    "any.required": messages.passwordsMatch,
  }),
}).options({ abortEarly: false });

const vDeleteAcc = Joi.object({
  currentPass: Joi.string().required().messages({
    "string.empty": messages.currentPassRequired,
  }),
}).options({ abortEarly: false });

const vOrganizerRequest = Joi.object({
  organization_name: Joi.string().trim().min(4).required().messages({
    "string.empty": messages.organizationNameRequired,
    "string.min": messages.organizationNameRequired,
  }),
  business_email: Joi.string()
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
    .required()
    .messages({
      "string.empty": messages.emailRequired,
      "string.pattern.base": messages.emailInvalid,
    }),
  bio: Joi.string().trim().allow("").optional(),
  location: Joi.string().trim().required().messages({
    "string.empty": messages.locationRequired,
  }),
  facebook: Joi.string().trim().required().messages({
    "string.empty": messages.facebookRequired,
  }),
  telegram: Joi.string().allow("").optional(),
  tiktok: Joi.string().allow("").optional(),
  linkin: Joi.string().allow("").optional(),
  business_phone: Joi.string()
    .trim()
    .required()
    .pattern(/^[0-9]{9,10}$/)
    .messages({
      "string.pattern.base": messages.phoneNumberInvalid,
      "string.empty": messages.phoneNumberRequired,
    }),
}).options({ abortEarly: false });

const vEventOverview = Joi.object({
  eng_name: Joi.string().trim().min(6).required().messages({
    "string.empty": messages.shortDescriptionRequired,
    "string.min": messages.shortDescriptionRequired,
  }),
  event_type: Joi.string().valid("1", "2").required().messages({
    "any.only": "Invalid event type selected.", // Adjust as needed
  }),
  event_categories: Joi.array().min(1).items(Joi.string()).required().messages({
    "array.min": "Please select at least one category.", // Adjust as needed
  }),
}).options({ abortEarly: false });

const vEventDateAndLocation = Joi.object({
  started_date: Joi.string().trim().required().messages({
    "string.empty": messages.startDateRequired,
  }),
  ended_date: Joi.string().trim().required().messages({
    "string.empty": messages.endDateRequired,
  }),
  start_time: Joi.string().trim().required().messages({
    "string.empty": messages.startTimeRequired,
  }),
  end_time: Joi.string().trim().required().messages({
    "string.empty": messages.endTimeRequired,
  }),
  location: Joi.string().trim().required().messages({
    "string.empty": messages.locationRequired,
  }),
}).options({ abortEarly: false });

const vEventDateOnline = Joi.object({
  started_date: Joi.string().trim().required().messages({
    "string.empty": messages.startDateRequired,
  }),
  ended_date: Joi.string().trim().required().messages({
    "string.empty": messages.endDateRequired,
  }),
  start_time: Joi.string().trim().required().messages({
    "string.empty": messages.startTimeRequired,
  }),
  end_time: Joi.string().trim().required().messages({
    "string.empty": messages.endTimeRequired,
  }),
  location: Joi.string().trim().allow("").optional().messages({
    "string.empty": messages.locationRequired,
  }),
}).options({ abortEarly: false });

const vEventDescription = Joi.object({
  short_description: Joi.string().trim().required().messages({
    "string.empty": messages.shortDescriptionRequired,
  }),
  description: Joi.string().trim().required().messages({
    "string.empty": messages.descriptionRequired,
  }),
}).options({ abortEarly: false });

const vEventAgenda = Joi.object({
  title: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": messages.shortDescriptionRequired,
    "string.min": messages.shortDescriptionRequired,
    "string.max": `Title must be at most 50 characters long`, // Adjust as needed
  }),
  description: Joi.string().trim().min(5).max(100).required().messages({
    "string.empty": messages.descriptionRequired,
    "string.min": messages.descriptionRequired,
    "string.max": `Title must be at most 100 characters long`, // Adjust as needed
  }),
  start_time: Joi.string().trim().required().messages({
    "string.empty": messages.startTimeRequired,
  }),
  end_time: Joi.string().trim().required().messages({
    "string.empty": messages.endTimeRequired,
  }),
}).options({ abortEarly: false });

const vUpdateEventAgenda = Joi.object({
  id: Joi.alternatives().try(
    Joi.number().integer().min(0), 
    Joi.string().valid('')
  ),
  title: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": messages.shortDescriptionRequired,
    "string.min": messages.shortDescriptionRequired,
    "string.max": `Title must be at most 50 characters long`, // Adjust as needed
  }),
  description: Joi.string().trim().min(5).max(100).required().messages({
    "string.empty": messages.descriptionRequired,
    "string.min": messages.descriptionRequired,
    "string.max": `Title must be at most 100 characters long`, // Adjust as needed
  }),
  start_time: Joi.string().trim().required().messages({
    "string.empty": messages.startTimeRequired,
  }),
  end_time: Joi.string().trim().required().messages({
    "string.empty": messages.endTimeRequired,
  }),
}).options({ abortEarly: false });

const vEventTickets = Joi.object({
  type: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": messages.ticketTypeRequired,
    "string.min": messages.ticketTypeRequired,
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Ticket price must be a number.", // Adjust as needed
    "number.min": "Ticket price cannot be negative.", // Adjust as needed
    "any.required": messages.ticketPriceRequired,
  }),
  ticket_opacity: Joi.number().integer().min(1).required().messages({
    "number.base": "Ticket capacity must be a number.", // Adjust as needed
    "number.integer": "Ticket capacity must be an integer.", // Adjust as needed
    "number.min": messages.ticketCapacityMin,
    "any.required": messages.ticketCapacityRequired,
  }),
}).options({ abortEarly: false });

const vUpdateEventTickets = Joi.object({
  id: Joi.alternatives().try(
    Joi.number().integer().min(0), 
    Joi.string().valid('')
  ),
  type: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": messages.ticketTypeRequired,
    "string.min": messages.ticketTypeRequired,
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Ticket price must be a number.", // Adjust as needed
    "number.min": "Ticket price cannot be negative.", // Adjust as needed
    "any.required": messages.ticketPriceRequired,
  }),
  ticket_opacity: Joi.number().integer().min(1).required().messages({
    "number.base": "Ticket capacity must be a number.", // Adjust as needed
    "number.integer": "Ticket capacity must be an integer.", // Adjust as needed
    "number.min": messages.ticketCapacityMin,
    "any.required": messages.ticketCapacityRequired,
  }),
}).options({ abortEarly: false });

const validateFile = (file, maxSizeMB = 3) => {
  if (!file) {
    return { valid: false, message: messages.fileTypeInvalid }; // No file, validation fails
  }

  const validExtensions = ['.jpg', '.jpeg', '.png'];
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));

  if (!(validExtensions.includes(fileExtension))) {
    return {
      valid: false,
      message: messages.fileTypeInvalid,
    };
  }

  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      message: messages.fileSizeExceeded(maxSizeMB),
    };
  }

  return { valid: true }; // All validations passed
};

const validateFileQR = (file, maxSizeMB = 3) => {
  if (!file) {
    return { valid: false, message: messages.fileTypeInvalid }; // No file, validation fails
  }

  const validExtensions = ['.jpg', '.jpeg', '.png'];
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
  
  if (!(validExtensions.includes(fileExtension))) {
    return {
      valid: false,
      message: messages.fileTypeInvalid,
    };
  }

  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      message: messages.fileSizeExceeded(maxSizeMB),
    };
  }

  return { valid: true }; // All validations passed
};

// const vSignIn = Joi.object({
//   email: Joi.string()
//     .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
//     .required()
//     .messages({
//       "string.empty": "Email is required.",
//       "string.pattern.base": "Invalid Email.",
//     }),
//   password: Joi.string().min(6).trim().required().messages({
//     "string.empty": "Password is required.",
//     "string.min": "Password must be at least 6 characters.",
//   }),
//   rememberMe: Joi.boolean().required(),
// }).options({ abortEarly: false });

// const vSignUp = Joi.object({
//   name: Joi.string().trim().min(4).required().messages({
//     "string.empty": "Username is required.",
//     "string.min": "Username must be at least 4 characters.",
//   }),
//   email: Joi.string()
//     .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
//     .required()
//     .messages({
//       "string.empty": "Email is required.",
//       "string.pattern.base": "Invalid Email.",
//     }),
//   password: Joi.string().min(6).trim().required().messages({
//     "string.empty": "Password is required.",
//     "string.min": "Password must be at least 6 characters.",
//   }),
//   confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
//     "any.only": "Password must match.",
//     "any.required": "Password must match.",
//   }),
// }).options({ abortEarly: false });

// const vForgotPassword = Joi.object({
//   email: Joi.string()
//     .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
//     .required()
//     .messages({
//       "string.empty": "Email is required.",
//       "string.pattern.base": "Invalid Email.",
//     }),
// }).options({ abortEarly: false });

// const vVerifyOtp = Joi.object({
//   verifyOtp: Joi.string()
//     .trim()
//     .required()
//     .pattern(/^\d{6}$/)
//     .messages({
//       "string.empty": "Otp Code is required.",
//       "string.pattern.base": "Otp Code must be exactly 6 digits.",
//     }),
// }).options({ abortEarly: false });

// const vResetPass = Joi.object({
//   newPassword: Joi.string().min(6).required().messages({
//     "string.empty": "Password is required.",
//     "string.min": "Password must be at least 6 characters.",
//   }),
//   confirmNewPassword: Joi.string()
//     .valid(Joi.ref("newPassword"))
//     .required()
//     .messages({
//       "any.only": "Passwords must match.",
//       "any.required": "Passwords must match.",
//     }),
// }).options({ abortEarly: false });

// const vProfileInfo = Joi.object({
//   eng_name: Joi.string().trim().min(4).required().messages({
//     "string.empty": "Username is required.",
//     "string.min": "Username must be at least 4 characters.",
//   }),
//   kh_name: Joi.string().trim().allow("").optional().min(4).messages({
//     "string.min": "Username must be at least 4 characters.",
//   }),
//   email: Joi.string()
//     .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
//     .required()
//     .messages({
//       "string.empty": "Email is required.",
//       "string.pattern.base": "Invalid Email.",
//     }),

//   phone: Joi.string()
//     .pattern(/^[0-9]{9,10}$/)
//     .allow("")
//     .optional()
//     .messages({
//       "string.pattern.base": "Phone number must be between 9 and 10 digits.",
//     }),
//   dob: Joi.date().max("now").allow("").optional().messages({
//     "string.max": "Invalid Date of Birth.",
//   }),
//   address: Joi.string().allow("").optional(),
//   gender: Joi.string().allow("").optional(),
// }).options({ abortEarly: false });

// const vChangePass = Joi.object({
//   oldPass: Joi.string().required().messages({
//     "string.empty": "Old Password is required.",
//   }),
//   newPass: Joi.string().required().messages({
//     "string.empty": "New Password is required.",
//   }),
//   newPassConfirm: Joi.string().valid(Joi.ref("newPass")).required().messages({
//     "any.only": "Passwords not match.",
//     "any.required": "Passwords not match.",
//   }),
// }).options({ abortEarly: false });

// const vDeleteAcc = Joi.object({
//   currentPass: Joi.string().required().messages({
//     "string.empty": "Current Password is required to delete account.",
//   }),
// }).options({ abortEarly: false });

// const vOrganizerRequest = Joi.object({
//   organization_name: Joi.string().trim().min(4).required().messages({
//     "string.empty": "Organization Name is required.",
//     "string.min": "Organization Name must be at least 4 characters.",
//   }),
//   business_email: Joi.string()
//     .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
//     .required()
//     .messages({
//       "string.empty": "Email is required.",
//       "string.pattern.base": "Invalid Email.",
//     }),
//   bio: Joi.string().trim().allow("").optional(),
//   location: Joi.string().trim().required().messages({
//     "string.empty": "Location is required.",
//   }),
//   facebook: Joi.string().trim().required().messages({
//     "string.empty": "Facebook is required.",
//   }),
//   telegram: Joi.string().allow("").optional(),
//   tiktok: Joi.string().allow("").optional(),
//   linkin: Joi.string().allow("").optional(),
//   business_phone: Joi.string()
//     .trim()
//     .required()
//     .pattern(/^[0-9]{9,10}$/)
//     .messages({
//       "string.pattern.base": "Phone number must be between 9 and 10 digits.",
//       "string.empty": "Phone number is required.",
//     }),
// }).options({ abortEarly: false });

// const vEventOverview = Joi.object({
//   eng_name: Joi.string().trim().min(6).required().messages({
//     "string.empty": "Event title is required.",
//     "string.min": "Event title must be at least 6 characters.",
//   }),
//   event_type: Joi.string().valid("1", "2").required().messages({
//     "any.only": "Invalid event type selected.",
//   }),
//   event_categories: Joi.array().min(1).items(Joi.string()).required().messages({
//     "array.min": "Please select at least one category.",
//   }),
// }).options({ abortEarly: false });

// const vEventDateAndLocation = Joi.object({
//   started_date: Joi.string().trim().required().messages({
//     "string.empty": "Start date is required.",
//   }),
//   ended_date: Joi.string().trim().required().messages({
//     "string.empty": "End date is required.",
//   }),
//   start_time: Joi.string().trim().required().messages({
//     "string.empty": "Start time is required.",
//   }),
//   end_time: Joi.string().trim().required().messages({
//     "string.empty": "End time is required.",
//   }),
//   location: Joi.string().trim().required().messages({
//     "string.empty": "Location is required.",
//   }),
// }).options({ abortEarly: false });

// const vEventDateOnline = Joi.object({
//   started_date: Joi.string().trim().required().messages({
//     "string.empty": "Start date is required.",
//   }),
//   ended_date: Joi.string().trim().required().messages({
//     "string.empty": "End date is required.",
//   }),
//   start_time: Joi.string().trim().required().messages({
//     "string.empty": "Start time is required.",
//   }),
//   end_time: Joi.string().trim().required().messages({
//     "string.empty": "End time is required.",
//   }),
//   location: Joi.string().trim().allow("").optional().messages({
//     "string.empty": "Location is required.",
//   }),
// }).options({ abortEarly: false });

// const vEventDescription = Joi.object({
//   short_description: Joi.string().trim().required().messages({
//     "string.empty": "Short Description is required.",
//   }),
//   description: Joi.string().trim().required().messages({
//     "string.empty": "Description Detail is required.",
//   }),
// }).options({ abortEarly: false });

// const vEventAgenda = Joi.object({
//   title: Joi.string().trim().min(3).max(50).required().messages({
//     "string.empty": "Title is required.",
//     "string.min": "Title must be at least 3 characters.",
//     "string.max": `Title must be at most {50} characters long`,
//   }),
//   description: Joi.string().trim().min(5).max(100).required().messages({
//     "string.empty": "Description is required.",
//     "string.min": "Description must be at least 5 characters.",
//     "string.max": `Title must be at most 100 characters long`,
//   }),
//   start_time: Joi.string().trim().required().messages({
//     "string.empty": "Start time is required.",
//   }),
//   end_time: Joi.string().trim().required().messages({
//     "string.empty": "End time is required.",
//   }),
// }).options({ abortEarly: false });

// const vUpdateEventAgenda = Joi.object({
//   id: Joi.alternatives().try(
//     Joi.number().integer().min(0),  // or just Joi.number().integer() if negative is allowed
//     Joi.string().valid('')
//   ),
//   title: Joi.string().trim().min(3).max(50).required().messages({
//     "string.empty": "Title is required.",
//     "string.min": "Title must be at least 3 characters.",
//     "string.max": `Title must be at most {50} characters long`,
//   }),
//   description: Joi.string().trim().min(5).max(100).required().messages({
//     "string.empty": "Description is required.",
//     "string.min": "Description must be at least 5 characters.",
//     "string.max": `Title must be at most 100 characters long`,
//   }),
//   start_time: Joi.string().trim().required().messages({
//     "string.empty": "Start time is required.",
//   }),
//   end_time: Joi.string().trim().required().messages({
//     "string.empty": "End time is required.",
//   }),
// }).options({ abortEarly: false });

// const vEventTickets = Joi.object({
//   type: Joi.string().trim().min(3).max(100).required().messages({
//     "string.empty": "Ticket type is required.",
//     "string.min": "Ticket type must be at least 3 characters.",
//   }),
//   price: Joi.number().min(0).required().messages({
//     "number.base": "Ticket price must be a number.",
//     "number.min": "Ticket price cannot be negative.",
//     "any.required": "Ticket price is required.",
//   }),
//   ticket_opacity: Joi.number().integer().min(1).required().messages({
//     "number.base": "Ticket capacity must be a number.",
//     "number.integer": "Ticket capacity must be an integer.",
//     "number.min": "Ticket capacity must be at least 1.",
//     "any.required": "Ticket capacity is required.",
//   }),
// }).options({ abortEarly: false });

// const vUpdateEventTickets = Joi.object({
//   id: Joi.alternatives().try(
//     Joi.number().integer().min(0),  // or just Joi.number().integer() if negative is allowed
//     Joi.string().valid('')
//   ),
//   type: Joi.string().trim().min(3).max(100).required().messages({
//     "string.empty": "Ticket type is required.",
//     "string.min": "Ticket type must be at least 3 characters.",
//   }),
//   price: Joi.number().min(0).required().messages({
//     "number.base": "Ticket price must be a number.",
//     "number.min": "Ticket price cannot be negative.",
//     "any.required": "Ticket price is required.",
//   }),
//   ticket_opacity: Joi.number().integer().min(1).required().messages({
//     "number.base": "Ticket capacity must be a number.",
//     "number.integer": "Ticket capacity must be an integer.",
//     "number.min": "Ticket capacity must be at least 1.",
//     "any.required": "Ticket capacity is required.",
//   }),
// }).options({ abortEarly: false });

// const validateFile = (file, maxSizeMB = 3) => {
//   if (!file) {
//     return { valid: false, message: 'Invalid file type. Only JPG, JPEG, PNG are allowed.' }; // No file, validation passes
//   }

//   const validExtensions = ['.jpg', '.jpeg', '.png'];
//   const fileName = file.name.toLowerCase();
//   const fileExtension = fileName.substring(fileName.lastIndexOf('.'));

//   if (!(validExtensions.includes(fileExtension))) {
//     return {
//       valid: false,
//       message: 'Invalid file type. Only JPG, JPEG, PNG are allowed.',
//     };
//   }

//   const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
//   if (file.size > maxSize) {
//     return {
//       valid: false,
//       message: `File size exceeds the limit of ${maxSizeMB}MB.`,
//     };
//   }

//   return { valid: true }; // All validations passed
// };

// const validateFileQR = (file, maxSizeMB = 3) => {
//   if (!file) {
//     return { valid: false, message: 'Payment Qr Image is required.' }; // No file, validation passes
//   }

//   const validExtensions = ['.jpg', '.jpeg', '.png'];
//   const fileName = file.name.toLowerCase();
//   const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
//   // console.log(file);
//   // console.log(fileExtension);
  
//   if (!(validExtensions.includes(fileExtension))) {
//     return {
//       valid: false,
//       message: 'Invalid file type. Only JPG, JPEG, PNG are allowed.',
//     };
//   }

//   const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
//   if (file.size > maxSize) {
//     return {
//       valid: false,
//       message: `File size exceeds the limit of ${maxSizeMB}MB.`,
//     };
//   }

//   return { valid: true }; // All validations passed
// };