const { Resend } = require('resend');

/**
 * Send email using Resend (Most reliable for Render/Cloud)
 * @param {Object} options - { email, subject, message, html }
 */
const sendEmail = async (options) => {
  try {
    // If RESEND_API_KEY is not set, we'll log it (helps user debug)
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is missing in environment variables');
      throw new Error('Email service not configured. Please add RESEND_API_KEY.');
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const data = await resend.emails.send({
      from: 'DealDrop <onboarding@resend.dev>', // You can change this once you verify your domain
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    });

    if (data.error) {
      console.error('❌ Resend Error:', data.error);
      throw new Error(data.error.message);
    }

    return data;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
