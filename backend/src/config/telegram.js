import TelegramBot from "node-telegram-bot-api"

const shouldUsePolling = process.env.TELEGRAM_BOT_POLLING === "true"

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: shouldUsePolling
})

export default bot