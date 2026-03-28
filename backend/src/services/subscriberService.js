import supabase from "../config/supabase.js"
import { generateActivationToken } from "../utils/generateToken.js"

export const createSubscriber = async ({
  email,
  stripeCustomerId,
  stripeSubscriptionId,
  status = "trialing"
}) => {

  const token = generateActivationToken()

  const { data, error } = await supabase
    .from("subscribers")
    .insert([
      {
        email,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        status,
        activation_token: token
      }
    ])
    .select()

  if (error) {
    console.error("Supabase insert error:", error)
    throw error
  }

  return data
}

export const getSubscriberByToken = async (token) => {
  const { data, error } = await supabase
    .from("subscribers")
    .select("*")
    .eq("activation_token", token)
    .single()

  if (error) {
    throw error
  }

  return data
}