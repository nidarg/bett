import { getSubscriberByToken } from "../services/subscriberService.js"

export const activateSubscriber = async (req, res) => {
  try {
    const { token } = req.query

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required"
      })
    }

    const subscriber = await getSubscriberByToken(token)

    res.json({
      success: true,
      subscriber
    })
  } catch (error) {
    console.error("Activation error:", error.message)

    res.status(404).json({
      success: false,
      message: "Invalid or expired token"
    })
  }
}