import { createSubscription } from "../services/subscriptionService.js"
import { isValidEmail } from "../utils/validateEmail.js"

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email invalid."
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const result = await createSubscription(normalizedEmail)

    return res.json(result)
  } catch (error) {
    console.error("Subscribe error:", error)

    return res.status(500).json({
      success: false,
      message: error.message || "Server error"
    })
  }
}