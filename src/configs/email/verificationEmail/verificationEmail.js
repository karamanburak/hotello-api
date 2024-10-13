"use strict";

const { CustomError } = require("../../../errors/customError");
const User = require("../../../models/user");
const crypto = require("crypto");
const sendMail = require("../nodeMailer");

const sendVerificationEmailTemplate = (
  email,
  firstName,
  verificationCode,
  unsubscribeURL
) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  <div style="background: linear-gradient(to right, #3b82f6, #2563eb); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p style="font-size: 16px;">Hello ${firstName},</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3b82f6;">${verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>Your Hotello Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
    <p>If you no longer wish to receive emails from us, you can unsubscribe<a href="${unsubscribeURL}" style="color: #3b82f6; text-decoration: none;"> here</a>.</p>
  </div>
</body>
</html>
`;
const welcomeEmailTemplate = (firstName, unsubscribeURL) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Hotello!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  <div style="background: linear-gradient(to right, #3b82f6, #2563eb); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Welcome to Hotello, ${firstName}!</h1>
  </div>
  <div style="background-color: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello ${firstName},</p>
    <p>We are thrilled to have you on board! Thank you for joining our community at Hotello.</p>
    <p>With Hotello, you'll have access to amazing features, exclusive deals, and personalized services to enhance your stay with us.</p>
    <p>We hope you enjoy your experience with us! If you have any questions or need assistance, feel free to reach out to our support team at any time.</p>
    <p>Best regards,<br>Your Hotello Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;
const passwordResetRequestEmailTemplate = (resetURL) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #FFA726, #FB8C00); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetURL}" style="background-color: #FFA726; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 2 minutes for security reasons.</p>
    <p>Best regards,<br>Your Hotello Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;
};

const passwordResetEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your Hotello Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const sendVerificationEmail = async (email, verificationToken, firstName) => {
  const subject = "Verify your email";
  const template = sendVerificationEmailTemplate(
    email,
    verificationToken,
    firstName
  );

  try {
    const response = await sendMail(email, subject, template);
    console.log("Verification email sent successfully:", response);
  } catch (error) {
    console.error(`Error sending verification email: ${error.message}`);
    throw CustomError(
      `Error sending verification email: ${error.message}`,
      404
    );
  }
};

// Function to send welcome email
const sendWelcomeEmail = async (email, firstName) => {
  const subject = "Welcome to Hotello!";

  // Generate an unsubscribe token
  const unsubscribeToken = crypto.randomBytes(32).toString("hex");
  const unsubscribeTokenExpiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours expiry

  // Update the user with the unsubscribe token
  await User.findByIdAndUpdate(userId, {
    unsubscribeToken,
    unsubscribeTokenExpiresAt,
  });

  const unsubscribeURL = `${process.env.BASE_URL}/unsubscribe/${unsubscribeToken}`;

  const template = welcomeEmailTemplate(firstName, unsubscribeURL);

  try {
    const response = await sendMail(email, subject, template);
    console.log("Welcome email sent successfully:", response);
  } catch (error) {
    console.error(`Error sending welcome email: ${error.message}`);
    throw CustomError(`Error sending welcome email: ${error.message}`, 404);
  }
};

// Function to send password reset request
const sendPasswordResetRequest = async (email, resetURL) => {
  const subject = "Password Reset Request";
  const template = passwordResetRequestEmailTemplate(resetURL);

  try {
    const response = await sendMail(email, subject, template);
    console.log("Password reset request email sent successfully:", response);
  } catch (error) {
    console.error(
      `Error sending password reset request email: ${error.message}`
    );
    throw CustomError(
      `Error sending password reset request email: ${error.message}`,
      404
    );
  }
};

// Function to send password reset confirmation
const sendPasswordResetConfirmation = async (email) => {
  const subject = "Password Reset Successful";
  const template = passwordResetEmailTemplate;

  try {
    const response = await sendMail(email, subject, template);
    console.log(
      "Password reset confirmation email sent successfully:",
      response
    );
  } catch (error) {
    console.error(
      `Error sending password reset confirmation email: ${error.message}`
    );
    throw CustomError(
      `Error sending password reset confirmation email: ${error.message}`,
      404
    );
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetRequest,
  sendPasswordResetConfirmation,
};
