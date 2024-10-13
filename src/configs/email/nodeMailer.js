"use strict";

const nodemailer = require("nodemailer");

const sendMail = async (to, subject, template) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Disable TLS security (use only in development)
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to,
      subject,
      html: template,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent: ${info.response}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

module.exports = sendMail;
