const express = require('express');

const {
    postSignUp,
    postSignIn,
    postForgotPassword,
    postResetPassword,
    verifyOtp,
    getMe,
    logout
} = require('../../controllers/api/auth');

const { requireAuth } = require('../../middlewares/auth');

const router = express.Router();

router.post('/signup', postSignUp);
router.post('/signin', postSignIn);
router.post('/forgot-password', postForgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', postResetPassword);
router.get('/me', requireAuth, getMe);
router.delete('/logout', logout);

module.exports = router;