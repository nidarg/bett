import express from "express"
import cors from "cors"
import "dotenv/config"
import subscribeRoutes from "./src/routes/subscribeRoutes.js"
import webhookRoutes from "./src/routes/webhookRoutes.js"

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())

app.use("/webhook", webhookRoutes)
app.use(express.json())

app.use("/api", subscribeRoutes)

app.get("/", (req, res) => {
  res.send("API running")
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})