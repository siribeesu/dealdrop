const twilio = require('twilio');

/**
 * Send SMS using Twilio
 * @param {string} to - Recipient phone number (+E.164 format)
 * @param {string} body - Message content
 */
const sendSMS = async (to, body) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
    const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER?.trim();

    if (!accountSid || !authToken || !twilioNumber) {
      console.warn('⚠️ Twilio credentials missing. Falling back to terminal log.');
      return null;
    }

    const client = new twilio(accountSid, authToken);

    const message = await client.messages.create({
      body,
      from: twilioNumber,
      to
    });

    console.log('✅ SMS sent successfully:', message.sid);
    return message;
  } catch (error) {
    console.error('❌ Twilio SMS failed:', error.message);
    // Even if it fails, we don't throw so the user can still see the OTP in terminal
    return null;
  }
};

module.exports = sendSMS;
