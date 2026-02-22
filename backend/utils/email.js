const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true, // Show debug output in logs
  logger: true // Log information to console
});

// Send email function
const sendEmail = async (options) => {
  // Email options
  const mailOptions = {
    from: `${process.env.FROM_NAME || 'DealDrop'} <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email successfully sent:', info.response);
    return info;
  } catch (error) {
    console.error('CRITICAL: Email delivery failed');
    console.error('Error details:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
