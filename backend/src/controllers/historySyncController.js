import { syncBetsFromSheet } from "../services/betSyncService.js"

export const syncHistoryFromSheet = async (req, res) => {
  const secret = req.headers["x-sync-secret"]

  if (secret !== process.env.SYNC_SECRET) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    })
  }

  try {
    const result = await syncBetsFromSheet()

    return res.json({
      success: true,
      message: "History synced successfully",
      data: result
    })
  } catch (error) {
    console.error("History sync controller error:", error)

    return res.status(500).json({
      success: false,
      message: error.message || "Could not sync history from sheet"
    })
  }
}