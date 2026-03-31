

import supabase from "../config/supabase.js"
import { generateActivationToken } from "../utils/generateToken.js"

export const createOrUpdateSubscriber = async ({
  email,
  stripeCustomerId,
  stripeSubscriptionId,
  status = "trialing"
}) => {
  const { data: existing } = await supabase
    .from("subscribers")
    .select("*")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .single()

  const activationToken =
    existing?.activation_token || generateActivationToken()

  const finalEmail = email || existing?.email || null

  const { data, error } = await supabase
    .from("subscribers")
    .upsert(
      [
        {
          email: finalEmail,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
          status,
          activation_token: activationToken
        }
      ],
      {
        onConflict: "stripe_subscription_id"
      }
    )
    .select()
    .single()

  if (error) {
    console.error("Supabase upsert error:", error)
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

export const updateSubscriberTelegramConnection = async ({
  token,
  chatId,
  telegramUsername
}) => {
  const { data, error } = await supabase
    .from("subscribers")
    .update({
      telegram_id: chatId,
      telegram_username: telegramUsername
    })
    .eq("activation_token", token)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export const saveSubscriberInviteLink = async ({
  token,
  inviteLink,
  expiresAt
}) => {
  const { data, error } = await supabase
    .from("subscribers")
    .update({
      telegram_invite_link: inviteLink,
      telegram_invite_expires_at: expiresAt
    })
    .eq("activation_token", token)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export const isInviteLinkStillValid = (subscriber) => {
  if (!subscriber?.telegram_invite_link || !subscriber?.telegram_invite_expires_at) {
    return false
  }

  const expiresAt = new Date(subscriber.telegram_invite_expires_at).getTime()
  return expiresAt > Date.now()
}