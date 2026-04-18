import express from "express"
import cors from "cors"
import "dotenv/config"
import subscribeRoutes from "./src/routes/subscribeRoutes.js"
import webhookRoutes from "./src/routes/webhookRoutes.js"
import activationRoutes from "./src/routes/activationRoutes.js"
import checkoutRoutes from "./src/routes/checkoutRoutes.js"
import { initTelegramBot } from "./src/services/telegramService.js"
import historyRoutes from "./src/routes/historyRoutes.js"
import testSheetsRoutes from "./src/routes/testSheetsRoutes.js"
import historySyncRoutes from "./src/routes/historySyncRoutes.js"

const app = express()
const PORT = process.env.PORT || 3000

const allowedOrigins = [
  "http://localhost:5173",
  "https://smart-bett.vercel.app"
]

app.use(
  cors({
    origin: function (origin, callback) {
      // permite requests fără origin (Postman, curl etc.)
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      } else {
        return callback(new Error("Not allowed by CORS"))
      }
    }
  })
)

app.use("/webhook", webhookRoutes)
app.use(express.json())

app.use("/api", subscribeRoutes)
app.use("/api", activationRoutes)
app.use("/api", checkoutRoutes)
app.use("/api", historyRoutes)
app.use("/api", testSheetsRoutes)
app.use("/api", historySyncRoutes)

app.get("/", (req, res) => {
  res.send("API running")
})

if (process.env.TELEGRAM_BOT_POLLING === "true") {
  initTelegramBot()
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})