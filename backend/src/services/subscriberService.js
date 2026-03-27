import supabase from "../config/supabase.js"

export const createSubscriber = async ({
  email,
  stripeCustomerId,
  stripeSubscriptionId,
  status = "trialing"
}) => {
  const { data, error } = await supabase
    .from("subscribers")
    .insert([
      {
        email,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        status
      }
    ])
    .select()

  if (error) {
    console.error("Supabase insert error:", error)
    throw error
  }

  return data
}