import nodemailer from 'nodemailer';
import config from '../configurations/config.js';

const sendEmailDev = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: config.mailTrap.host,
    port: config.mailTrap.port,
    auth: {
      user: config.mailTrap.user,
      pass: config.mailTrap.password,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Made in Uganda <madeInUganda@app.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

export default {
  sendEmailDev,
};
