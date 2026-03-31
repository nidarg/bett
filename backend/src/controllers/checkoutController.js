import stripe from "../config/stripe.js"
import { getSubscriberBySubscriptionId } from "../services/subscriberService.js"

export const getCheckoutSessionActivation = async (req, res) => {
  try {
    const { session_id } = req.query

    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: "session_id is required"
      })
    }

    const session = await stripe.checkout.sessions.retrieve(session_id)

    if (!session || !session.subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found for this session"
      })
    }

    const subscriber = await getSubscriberBySubscriptionId(session.subscription)

    return res.json({
      success: true,
      activationToken: subscriber.activation_token,
      subscriber: {
        email: subscriber.email,
        status: subscriber.status
      }
    })
  } catch (error) {
    console.error("Get checkout session activation error:", error.message)

    return res.status(500).json({
      success: false,
      message: "Could not retrieve activation data"
    })
  }
}