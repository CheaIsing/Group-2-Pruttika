const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = async (email, otp) => {
  const resetLink = `http://localhost:${process.env.PORT || 3000}/reset-password/${email}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Click the following link to reset your password: ${resetLink}`,
    html: `
      <p>Use the following OTP to reset your password:</p>
      <p>OTP: ${otp}</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
      <p>Or click the following link to reset your password:</p>
      <p><a href="${resetLink}">Reset Password</a></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully.");
  } catch (err) {
    console.error("Error sending password reset email:", err);
    throw new Error("Error sending password reset email");
  }
};

module.exports = { sendPasswordResetEmail };
