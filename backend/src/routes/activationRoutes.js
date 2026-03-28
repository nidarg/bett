import express from "express"
import { activateSubscriber } from "../controllers/activationController.js"

const router = express.Router()

router.get("/activate", activateSubscriber)

export default router