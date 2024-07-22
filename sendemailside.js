// sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use any email service provider
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password",
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to,
    subject,
    text,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

module.exports = sendEmail;
