import bot from "../config/telegram.js"

const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID
const INVITE_EXPIRE_HOURS = Number(process.env.TELEGRAM_INVITE_EXPIRE_HOURS || 24)
const INVITE_MEMBER_LIMIT = Number(process.env.TELEGRAM_INVITE_MEMBER_LIMIT || 1)

export const createSingleUserInviteLink = async ({ subscriberId }) => {
  if (!TELEGRAM_CHANNEL_ID) {
    throw new Error("TELEGRAM_CHANNEL_ID is missing")
  }

  const expireDate = Math.floor(Date.now() / 1000) + INVITE_EXPIRE_HOURS * 60 * 60

  try {
    const inviteLink = await bot.createChatInviteLink(TELEGRAM_CHANNEL_ID, {
      expire_date: expireDate,
      member_limit: INVITE_MEMBER_LIMIT,
      name: `sub-${subscriberId}`
    })

    return {
      inviteLink: inviteLink.invite_link,
      expireDate: inviteLink.expire_date
    }
  } catch (error) {
    console.error("Create invite link error:", error?.response?.body || error.message)
    throw new Error("Could not create Telegram invite link")
  }
}