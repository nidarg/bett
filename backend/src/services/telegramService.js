import bot from "../config/telegram.js"
import {
  getSubscriberByToken,
  updateSubscriberTelegramConnection,
  saveSubscriberInviteLink,
  isInviteLinkStillValid
} from "./subscriberService.js"
import { createSingleUserInviteLink } from "./telegramInviteService.js"

const INVITE_EXPIRE_HOURS = Number(process.env.TELEGRAM_INVITE_EXPIRE_HOURS || 24)

export const initTelegramBot = () => {
  bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id
    const token = match?.[1]?.trim()
    const telegramUsername = msg.from?.username || null

    console.log("Telegram /start received")
    console.log("Full text:", msg.text)
    console.log("Chat ID:", chatId)
    console.log("Token:", token)
    console.log("Username:", telegramUsername)

    try {
      if (!token) {
        await bot.sendMessage(
          chatId,
          "Link invalid. Te rugăm să accesezi linkul de activare din platformă."
        )
        return
      }

      const subscriber = await getSubscriberByToken(token)

      if (!subscriber) {
        await bot.sendMessage(chatId, "Token invalid sau expirat.")
        return
      }

      const sameTelegramUser =
        subscriber.telegram_id && String(subscriber.telegram_id) === String(chatId)

      if (subscriber.telegram_id && !sameTelegramUser) {
        await bot.sendMessage(
          chatId,
          "Acest abonament este deja conectat la un alt cont de Telegram."
        )
        return
      }

      await updateSubscriberTelegramConnection({
        token,
        chatId,
        telegramUsername
      })

      if (isInviteLinkStillValid(subscriber)) {
        await bot.sendMessage(
  chatId,
  [
    `✅ Contul asociat cu ${subscriber.email} a fost conectat cu succes.`,
    "",
    "🔗 Link privat de acces:",
    subscriber.telegram_invite_link,
    "",
    `⏳ Linkul expiră în ${INVITE_EXPIRE_HOURS} ore.`,
    "👤 Poate fi folosit o singură dată."
  ].join("\n")
)
  
        return
      }

      const inviteLinkData = await createSingleUserInviteLink({
        subscriberId: subscriber.id
      })

      const expiresAtIso = new Date(inviteLinkData.expireDate * 1000).toISOString()

      await saveSubscriberInviteLink({
        token,
        inviteLink: inviteLinkData.inviteLink,
        expiresAt: expiresAtIso
      })

      await bot.sendMessage(
        chatId,
        [
          `Contul asociat cu ${subscriber.email} a fost conectat cu succes.`,
          "",
          "Acesta este linkul tău privat de acces:",
          inviteLinkData.inviteLink,
          "",
          `Linkul expiră în ${INVITE_EXPIRE_HOURS} ore și poate fi folosit o singură dată.`
        ].join("\n")
      )
    } catch (error) {
      console.error("Telegram error:", error)

      await bot.sendMessage(
        chatId,
        "Token invalid, expirat sau nu s-a putut genera linkul de acces."
      )
    }
  })

  bot.on("message", (msg) => {
    console.log("CHAT ID:", msg.chat.id)
    console.log("CHAT TYPE:", msg.chat.type)
    console.log("MESSAGE TEXT:", msg.text)
  })
}