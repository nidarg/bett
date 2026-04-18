const REQUIRED_HEADERS = [
  "externalId",
  "match",
  "betType",
  "odds",
  "stake",
  "betDetails",
  "payout",
  "profitLoss",
  "settledAt"
]

const normalizeDate = (value) => {
  if (!value) return null

  const normalized = value.trim().replace(" ", "T")
  const date = new Date(normalized)

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid settledAt date: ${value}`)
  }

  return date.toISOString()
}

const toNumber = (value, fieldName) => {
  const number = Number(value)

  if (Number.isNaN(number)) {
    throw new Error(`Invalid numeric value for ${fieldName}: ${value}`)
  }

  return number
}

export const parseSheetRows = (rows) => {
  if (!rows || rows.length === 0) {
    return []
  }

  const [headerRow, ...dataRows] = rows

  const missingHeaders = REQUIRED_HEADERS.filter(
    (header) => !headerRow.includes(header)
  )

  if (missingHeaders.length > 0) {
    throw new Error(
      `Missing required headers: ${missingHeaders.join(", ")}`
    )
  }

  return dataRows
    .filter((row) => row.some((cell) => String(cell || "").trim() !== ""))
    .map((row, index) => {
      const rowObject = Object.fromEntries(
        headerRow.map((header, columnIndex) => [header, row[columnIndex] || ""])
      )

      try {
        return {
          externalId: rowObject.externalId.trim(),
          match: rowObject.match.trim(),
          betType: rowObject.betType.trim(),
          odds: toNumber(rowObject.odds, "odds"),
          stake: toNumber(rowObject.stake, "stake"),
          betDetails: rowObject.betDetails.trim(),
          payout: toNumber(rowObject.payout, "payout"),
          profitLoss: toNumber(rowObject.profitLoss, "profitLoss"),
          settledAt: normalizeDate(rowObject.settledAt)
        }
      } catch (error) {
        throw new Error(`Row ${index + 2}: ${error.message}`)
      }
    })
}