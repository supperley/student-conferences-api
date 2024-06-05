import nodemailer from 'nodemailer';

export const sendEmail = async (user, mail) => {
  try {
    const mailOptions = mail;
    mailOptions.to = user.email;
    mailOptions.from = process.env.MAIL_USER;

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail(mailOptions);
  } catch (e) {
    console.error('sendEmail error:', e);
    throw e;
  }
};
