import supabase from "../config/supabase.js"
import { getSheetRows } from "./googleSheetsService.js"
import { parseSheetRows } from "../utils/parseSheetRows.js"
import { calculateBetResult } from "../utils/calculateBetResult.js"

const mapSheetBetToDbBet = (bet) => {
  const result = calculateBetResult({
    profitLoss: bet.profitLoss,
    settledAt: bet.settledAt
  })

  return {
    external_id: bet.externalId,
    meci: bet.match,
    pariu: bet.betType,
    cota: bet.odds,
    miza: bet.stake,
    pariu_concret: bet.betDetails,
    suma_rezultat: bet.payout,
    profit_pierdere: bet.profitLoss,
    inchis_la: bet.settledAt,
    rezultat: result
  }
}

export const syncBetsFromSheet = async () => {
  const rows = await getSheetRows()
  const parsedBets = parseSheetRows(rows)

  if (!parsedBets.length) {
    return {
      importedCount: 0,
      bets: []
    }
  }
  // console.log("TOTAL din sheet:", parsedBets.length)

const filteredBets = parsedBets.filter(bet => {
  return (
    bet.publishToSite === true &&
    bet.settledAt
  )
})

// console.log("ELIGIBLE pentru sync:", filteredBets.length)

// console.log(
//   "EXTERNAL IDs sincronizate:",
//   filteredBets.map(b => b.externalId)
// )

if (!filteredBets.length) {
  return {
    importedCount: 0,
    message: "No bets eligible for sync"
  }
}

const betsToUpsert = filteredBets.map(mapSheetBetToDbBet)

  const { data, error } = await supabase
    .from("pariuri_istoric")
    .upsert(betsToUpsert, {
      onConflict: "external_id"
    })
    .select()

  if (error) {
    console.error("Sync bets from sheet error:", error)
    throw error
  }

  return {
    importedCount: data.length,
    bets: data
  }
}