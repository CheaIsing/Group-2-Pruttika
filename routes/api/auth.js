const express = require('express');

const {
    postSignUp,
    postSignIn,
    postForgotPassword,
    postResetPassword,
    verifyOtp,
    logout
} = require('../../controllers/api/auth');

const router = express.Router();

router.post('/signup', postSignUp);
router.post('/signin', postSignIn);
router.post('/forgot-password', postForgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', postResetPassword);
router.delete('/logout', logout);

module.exports = router;