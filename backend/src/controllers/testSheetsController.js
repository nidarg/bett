import { getSheetRows } from "../services/googleSheetsService.js"
import { parseSheetRows } from "../utils/parseSheetRows.js"

export const testSheets = async (req, res) => {
  try {
    const rows = await getSheetRows()
    const parsedRows = parseSheetRows(rows)

    return res.json({
      success: true,
      rows: parsedRows
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}