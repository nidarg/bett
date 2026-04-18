import express from "express"
import { syncHistoryFromSheet } from "../controllers/historySyncController.js"

const router = express.Router()

router.post("/history/sync-sheet", syncHistoryFromSheet)

export default router