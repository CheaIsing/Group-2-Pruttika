const Joi = require('joi');

const vSignUp = Joi.object({
  eng_name: Joi.string().trim().min(4).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Password and confirm password must match",
    "any.required": "Confirm Password is required",
  }),
}).options({ abortEarly: false });

const vSignIn = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
}).options({ abortEarly: false });

const vForgotPass = Joi.object({
  email: Joi.string().email().required(),
}).options({ abortEarly: false });

const vVerifyOTP = Joi.object({
  email: Joi.string().email().required(),
  verifyOtp: Joi.string().required(),
}).options({ abortEarly: false });

const vResetPass = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Password and confirm password must match",
      "any.required": "Confirm Password is required",
    }),
}).options({ abortEarly: false });

module.exports = {
    vSignUp,
    vSignIn,
    vForgotPass,
    vVerifyOTP,
    vResetPass
}