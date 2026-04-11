const nodemailer = require('nodemailer');

/**
 * Send email using Nodemailer (Gmail SMTP)
 * @param {Object} options - { email, subject, message, html }
 */
const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // Helps in some cloud environments
      }
    });

    const mailOptions = {
      from: `DealDrop <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ EMAIL SERVICE ERROR:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    throw error;
  }
};

module.exports = sendEmail;
