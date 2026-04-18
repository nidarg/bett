import express from "express"
import { testSheets } from "../controllers/testSheetsController.js"

const router = express.Router()

router.get("/test-sheets", testSheets)

export default router