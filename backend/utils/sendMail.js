const nodemailer = require("nodemailer");
const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "asmitkhanal335@gmail.com",
      pass: "yxfrjrdpjcszbzgh",
    },
  });

  const mailOptions = {
    from: "Namaskar NodeJs <asmitkhanal335@gmail.com>",
    to: data.email,
    subject: data.subject,
    text: data.message,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
