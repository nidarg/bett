import { getHistoryByPeriod } from "../services/betHistoryService.js"

export const getHistory = async (req, res) => {
  try {
    const { period } = req.query

    if (!period) {
      return res.status(400).json({
        success: false,
        message: "period is required (daily | weekly | monthly)"
      })
    }

    if (!["daily", "weekly", "monthly"].includes(period)) {
      return res.status(400).json({
        success: false,
        message: "Invalid period"
      })
    }

    const result = await getHistoryByPeriod(period)

    return res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error("Get history controller error:", error)

    return res.status(500).json({
      success: false,
      message: "Could not retrieve history"
    })
  }
}