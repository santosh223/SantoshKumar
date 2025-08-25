const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service:"gmail",
  auth: {
    user: process.env.mail,
    pass: process.env.mailPass,
  },
});

exports.sendEmail = async (user) => {
  const info = await transporter.sendMail({
    from: 'Santosh kumar',
    to: user.email, 
    subject: "File Uploaded Successfully",
    text: "Hello world?", 
    html: `"<b>File is Uploaded</b>"`, 
  });

  console.log("Message sent:", info.messageId);
};