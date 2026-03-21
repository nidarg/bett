export const processStripeEvent = (event) => {

  console.log("Stripe event received:", event.type)

  switch (event.type) {

    case "checkout.session.completed":
      console.log("Checkout completed")
      break

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