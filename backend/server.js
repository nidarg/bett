import express from "express"
import cors from "cors"
import "dotenv/config"
import subscribeRoutes from "./src/routes/subscribeRoutes.js"
import webhookRoutes from "./src/routes/webhookRoutes.js"
import activationRoutes from "./src/routes/activationRoutes.js"
import checkoutRoutes from "./src/routes/checkoutRoutes.js"
import { initTelegramBot } from "./src/services/telegramService.js"
import historyRoutes from "./src/routes/historyRoutes.js"

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: process.env.FRONTEND_URL
}))

app.use("/webhook", webhookRoutes)
app.use(express.json())

app.use("/api", subscribeRoutes)
app.use("/api", activationRoutes)
app.use("/api", checkoutRoutes)
app.use("/api", historyRoutes)

app.get("/", (req, res) => {
  res.send("API running")
})

if (process.env.TELEGRAM_BOT_POLLING === "true") {
  initTelegramBot()
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})