import bot from "../config/telegram.js"

const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID

export const revokeTelegramAccess = async ({ telegramId }) => {
  if (!TELEGRAM_CHANNEL_ID) {
    throw new Error("TELEGRAM_CHANNEL_ID is missing")
  }

  if (!telegramId) {
    console.log("No telegramId found. Nothing to revoke.")
    return
  }

  try {
    await bot.banChatMember(TELEGRAM_CHANNEL_ID, telegramId)

    // opțional: imediat după ban poți da unban
    // astfel userul este scos, dar poate reintra doar cu invite link nou valid
    await bot.unbanChatMember(TELEGRAM_CHANNEL_ID, telegramId, {
      only_if_banned: true
    })

    console.log(`Telegram access revoked for user ${telegramId}`)
  } catch (error) {
    console.error(
      "Revoke Telegram access error:",
      error?.response?.body || error.message
    )
    throw new Error("Could not revoke Telegram access")
  }
}