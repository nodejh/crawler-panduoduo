const nodemailer = require('nodemailer');
const mailConfig = require('./../../config/config').email;


// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: mailConfig.host,
  port: 587,
  secure: mailConfig.secure, // upgrade later with STARTTLS
  auth: {
    user: mailConfig.username,
    pass: mailConfig.password,
  },
});


const sendMail = (subject, text, html) => {
  // setup email data with unicode symbols
  const mailOptions = {
    from: mailConfig.from, // sender address
    to: mailConfig.to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
};


// try {
//   console.log(a.toString());
// } catch (e) {
//   console.log(e);
//   const subject = `🤒 ${e.message}`;
//   const text = e.stack;
//   const html = `<p>${e.stack}</p>`;
//   sendMail(subject, text, html);
// }

// sendMail();

module.exports = sendMail;
