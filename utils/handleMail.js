const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "c1f779a548398e",
      pass: "96f1b9f25858f6"
    }
  });
  module.exports = transporter;