const express = require('express');
const router = express.Router();

// Stripe webhook endpoint
router.post('/stripe', async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event = req.body;

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent was successful!', paymentIntent);
        // Handle successful payment
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log('PaymentMethod was attached to a Customer!', paymentMethod);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// PayPal webhook endpoint
router.post('/paypal', async (req, res) => {
  try {
    const event = req.body;
    console.log('PayPal webhook received:', event);

    // Verify webhook signature if needed
    // const isValid = verifyPayPalSignature(req);
    // if (!isValid) {
    //   return res.status(400).send('Invalid signature');
    // }

    // Handle different event types
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        console.log('PayPal payment completed:', event.resource);
        // Handle successful payment
        break;
      case 'PAYMENT.CAPTURE.DENIED':
        console.log('PayPal payment denied:', event.resource);
        // Handle failed payment
        break;
      default:
        console.log(`Unhandled PayPal event type ${event.event_type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    res.status(500).json({ error: 'PayPal webhook handler failed' });
  }
});

module.exports = router;
