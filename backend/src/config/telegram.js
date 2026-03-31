import TelegramBot from "node-telegram-bot-api"

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true
})

export default bot