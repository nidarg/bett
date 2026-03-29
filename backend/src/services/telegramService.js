import bot from "../config/telegram.js"
import { getSubscriberByToken } from "./subscriberService.js"
import supabase from "../config/supabase.js"

export const initTelegramBot = () => {
  bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id
    const token = match?.[1]

    console.log("Telegram /start received")
    console.log("Chat ID:", chatId)
    console.log("Token:", token)

    try {
      if (!token) {
        await bot.sendMessage(
          chatId,
          "Link invalid. Te rugăm să accesezi linkul de activare din platformă."
        )
        return
      }

      const subscriber = await getSubscriberByToken(token)

      await supabase
        .from("subscribers")
        .update({ telegram_id: chatId })
        .eq("activation_token", token)

      await bot.sendMessage(
        chatId,
        `Contul asociat cu ${subscriber.email} a fost conectat cu succes.`
      )
    } catch (error) {
      console.error("Telegram error:", error.message)

      await bot.sendMessage(
        chatId,
        "Token invalid sau expirat."
      )
    }
  })
}