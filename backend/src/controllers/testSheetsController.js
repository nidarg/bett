import { getSheetRows } from "../services/googleSheetsService.js"

export const testSheets = async (req, res) => {
  try {
    const rows = await getSheetRows()

    return res.json({
      success: true,
      headerRow: rows[0],
      rowsCount: rows.length
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}