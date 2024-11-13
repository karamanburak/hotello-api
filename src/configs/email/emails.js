"use strict";

const { CustomError } = require("../../errors/customError");
const User = require("../../models/user");
const crypto = require("crypto");
const sendMail = require("./nodeMailer");
const {
  sendVerificationEmailTemplate,
  welcomeEmailTemplate,
  passwordResetRequestEmailTemplate,
  passwordResetConfirmationEmailTemplate,
} = require("./emailTemplates");

const sendVerificationEmail = async (email, verificationToken, firstName) => {
  const subject = "Verify your email";
  const template = sendVerificationEmailTemplate(verificationToken, firstName);

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
const sendWelcomeEmail = async (userId, email, firstName) => {
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
const sendPasswordResetRequestEmail = async (email, firstName, resetURL) => {
  const subject = "Password Reset Request";
  const template = passwordResetRequestEmailTemplate(firstName, resetURL);

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
const sendPasswordResetConfirmationEmail = async (email, firstName) => {
  const subject = "Password Reset Successful";
  const template = passwordResetConfirmationEmailTemplate(firstName);

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
  sendPasswordResetRequestEmail,
  sendPasswordResetConfirmationEmail,
};
