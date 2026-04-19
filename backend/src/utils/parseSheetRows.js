const REQUIRED_HEADERS = [
  "externalId",
  "match",
  "betType",
  "odds",
  "stake",
  "betDetails",
  "payout",
  "profitLoss",
  "settledAt",
  "publishToSite"
]

const normalizeHeader = (value) => {
  return String(value || "").trim().toLowerCase()
}

const normalizeDate = (value) => {
  if (!value) return null

  const normalized = String(value).trim().replace(" ", "T")
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

  const [rawHeaderRow, ...dataRows] = rows

  const headerMap = {}

  rawHeaderRow.forEach((header, index) => {
    headerMap[normalizeHeader(header)] = index
  })

  const missingHeaders = REQUIRED_HEADERS.filter(
    (header) => !(normalizeHeader(header) in headerMap)
  )

  if (missingHeaders.length > 0) {
    throw new Error(
      `Missing required headers: ${missingHeaders.join(", ")}`
    )
  }

  return dataRows
    .filter((row) => row.some((cell) => String(cell || "").trim() !== ""))
    .map((row, index) => {
      const getValue = (headerName) => {
        const columnIndex = headerMap[normalizeHeader(headerName)]
        return row[columnIndex] || ""
      }

      try {
        return {
          externalId: String(getValue("externalId")).trim(),
          match: String(getValue("match")).trim(),
          betType: String(getValue("betType")).trim(),
          odds: toNumber(getValue("odds"), "odds"),
          stake: toNumber(getValue("stake"), "stake"),
          betDetails: String(getValue("betDetails")).trim(),
          payout: toNumber(getValue("payout"), "payout"),
          profitLoss: toNumber(getValue("profitLoss"), "profitLoss"),
          settledAt: normalizeDate(getValue("settledAt")),
          publishToSite:
            String(getValue("publishToSite")).trim().toLowerCase() === "true"
        }
      } catch (error) {
        throw new Error(`Row ${index + 2}: ${error.message}`)
      }
    })
}