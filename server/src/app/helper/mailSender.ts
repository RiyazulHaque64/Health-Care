import nodemailer from "nodemailer";
import config from "../../config";

const mailSender = async (receiverEmail: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.mailSender.email,
      pass: config.mailSender.pass,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  const info = await transporter.sendMail({
    from: '"PH Healthcare" <riyazulhaque64@gmail.com>', // sender address
    to: receiverEmail, // list of receivers
    subject: "Password reset link", // Subject line
    // text: "Hello world?", // plain text body
    html, // html body
  });

  console.log("Message sent: %s", info.messageId);
};

export default mailSender;
