const initMail = require("./initMail");

const { MAIL_ADDRESS, MAIL_SENDER } = process.env;

const sendEmail = async ({ to, subject, html, attachments }) => {
  const transporter = await initMail();
  await transporter.sendMail({
    from: MAIL_SENDER + " <" + MAIL_ADDRESS + ">",
    to,
    subject,
    html,
    attachments,
  });
};

module.exports = sendEmail;
