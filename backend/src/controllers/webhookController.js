import stripe from "../config/stripe.js"
import { processStripeEvent } from "../services/webhookService.js"

export const handleStripeWebhook = (req, res) => {
  const signature = req.headers["stripe-signature"]

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    // trimitem eventul către service
    processStripeEvent(event)

    res.json({ received: true })

  } catch (error) {
    console.error("Webhook error:", error.message)
    res.status(400).send(`Webhook Error: ${error.message}`)
  }
}