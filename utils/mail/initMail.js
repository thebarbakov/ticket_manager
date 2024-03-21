const nodemailer = require("nodemailer");

const { MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_AUTH_USER, MAIL_AUTH_PASS } =
  process.env;

async function initMail() {
  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: MAIL_SECURE,
    auth: {
      user: MAIL_AUTH_USER,
      pass: MAIL_AUTH_PASS,
    },
    // tls: {rejectUnauthorized: false},
  });

  return transporter;
}

module.exports = initMail;
