import { createOrUpdateSubscriber, clearSubscriberInviteLink } from "./subscriberService.js"
import { revokeTelegramAccess } from "./telegramAccessService.js"

export const processStripeEvent = async (event) => {
  console.log("Stripe event received:", event.type)

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object

      const subscriber = await createOrUpdateSubscriber({
        email: session.customer_email,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        status: "trialing"
      })

      console.log("Subscriber upserted:", subscriber)
      break
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object

      const subscriber = await createOrUpdateSubscriber({
        email: null,
        stripeCustomerId: subscription.customer,
        stripeSubscriptionId: subscription.id,
        status: subscription.status
      })

      console.log("Subscription updated:", subscription.id, subscription.status)

      if (["past_due", "unpaid", "incomplete_expired", "canceled"].includes(subscription.status)) {
        if (subscriber?.telegram_id) {
          await revokeTelegramAccess({
            telegramId: subscriber.telegram_id
          })
        }

        await clearSubscriberInviteLink({
          stripeSubscriptionId: subscription.id
        })
      }

      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object

      const subscriber = await createOrUpdateSubscriber({
        email: null,
        stripeCustomerId: subscription.customer,
        stripeSubscriptionId: subscription.id,
        status: "canceled"
      })

      console.log("Subscription canceled:", subscription.id)

      if (subscriber?.telegram_id) {
        await revokeTelegramAccess({
          telegramId: subscriber.telegram_id
        })
      }

      await clearSubscriberInviteLink({
        stripeSubscriptionId: subscription.id
      })

      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object

      console.log("Payment failed for subscription:", invoice.subscription)
      break
    }

    default: {
      console.log("Unhandled event type:", event.type)
    }
  }
}