const nodemailer = require("nodemailer");
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,GMAIL_APP_PASSWORD,GMAIL_EMAIL_ID } = require("../../config/appConfig");

async function sendEmailToMailTrap(req,res){
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
    const { email, subject, description } = req.body;
    const message = {
      from: 'karavadiadhruv22@gmail.com',
      to: email,
      subject: subject,
      text: description,
    };

    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
    res.status(200).send(info);
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(error.status).send(err.message); // You might want to handle this error at a higher level in your code.
  }
}
async function sendEmailToGmail(options) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use the appropriate service (e.g., 'Gmail', 'SendGrid', etc.)
      auth: {
        user: GMAIL_EMAIL_ID,
        pass: GMAIL_APP_PASSWORD,
      },
    });
    const message = {
      from: 'karavadiadhruv22@gmail.com',
      to: options.email,
      subject: options.subject,
      html: options.html,
    };
    await transporter.sendMail(message);
}

module.exports = {
  sendEmailToGmail,
  sendEmailToMailTrap
}