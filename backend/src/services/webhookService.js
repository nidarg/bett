import { createSubscriber } from "./subscriberService.js"

export const processStripeEvent = async (event) => {
  console.log("Stripe event received:", event.type)

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object

      console.log("Checkout completed")
      console.log("Session ID:", session.id)
      console.log("Customer ID:", session.customer)
      console.log("Subscription ID:", session.subscription)
      console.log("Customer Email:", session.customer_email)

      const subscriber = await createSubscriber({
        email: session.customer_email,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        status: "trialing"
      })

      console.log("Subscriber saved in database:", subscriber)

      break
    }

    case "customer.subscription.updated":
      console.log("Subscription updated")
      break

    case "customer.subscription.deleted":
      console.log("Subscription deleted")
      break

    case "invoice.payment_failed":
      console.log("Payment failed")
      break

    default:
      console.log("Unhandled event type:", event.type)
  }
}