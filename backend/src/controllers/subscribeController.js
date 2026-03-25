import { createSubscription } from "../services/subscriptionService.js"

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body

    const result = await createSubscription(email)

    res.json(result)
  } catch (error) {
    console.error("Subscribe error:", error)

    res.status(500).json({
      success: false,
      message: error.message || "Server error"
    })
  }
}