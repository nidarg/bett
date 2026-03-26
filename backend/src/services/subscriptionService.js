import stripe from "../config/stripe.js"

export const createSubscription = async (email) => {
  // console.log("Creating checkout for:", email)
  // console.log("Secret key exists:", !!process.env.STRIPE_SECRET_KEY)
  // console.log("Price ID:", process.env.STRIPE_PRICE_ID)
  // console.log("Frontend URL:", process.env.FRONTEND_URL)

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: email,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1
      }
    ],
    subscription_data: {
      trial_period_days: 7
    },
    success_url: `${process.env.FRONTEND_URL}/success`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`
  })

  console.log("Stripe session created:", session.id)

  return {
    url: session.url
  }
}