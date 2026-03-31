import express from "express"
import { getCheckoutSessionActivation } from "../controllers/checkoutController.js"

const router = express.Router()

router.get("/checkout-session", getCheckoutSessionActivation)

export default router