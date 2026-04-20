import supabase from "../config/supabase.js"
import { calculateBetResult } from "../utils/calculateBetResult.js"

export const createBet = async ({
  match,
  betType,
  odds,
  stake,
  betDetails,
  payout = 0,
  profitLoss = 0,
  settledAt = null
}) => {
  const result = calculateBetResult({
    profitLoss,
    settledAt
  })

  const { data, error } = await supabase
    .from("pariuri_istoric")
    .insert({
      meci: match,
      pariu: betType,
      cota: odds,
      miza: stake,
      pariu_concret: betDetails,
      suma_rezultat: payout,
      profit_pierdere: profitLoss,
      inchis_la: settledAt,
      rezultat: result
    })
    .select()
    .single()

  if (error) {
    console.error("Create bet error:", error)
    throw error
  }

  return data
}

const getNowInRomania = () => {
  const now = new Date()

  const roString = now.toLocaleString("en-US", {
    timeZone: "Europe/Bucharest"
  })

  return new Date(roString)
}

const getDateRangeByPeriod = (period) => {
  const now = getNowInRomania()

  if (period === "daily") {
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)

    const end = new Date(now)
    end.setHours(23, 59, 59, 999)

    return {
      start: new Date(start.toISOString()),
      end: new Date(end.toISOString())
    }
  }

  if (period === "weekly") {
    const day = now.getDay()
    const diffToMonday = day === 0 ? 6 : day - 1

    const start = new Date(now)
    start.setDate(now.getDate() - diffToMonday)
    start.setHours(0, 0, 0, 0)

    const end = new Date(now)
    end.setHours(23, 59, 59, 999)

    return {
      start: new Date(start.toISOString()),
      end: new Date(end.toISOString())
    }
  }

  if (period === "monthly") {
    const start = new Date(now)
    start.setDate(1)
    start.setHours(0, 0, 0, 0)

    const end = new Date(now)
    end.setHours(23, 59, 59, 999)

    return {
      start: new Date(start.toISOString()),
      end: new Date(end.toISOString())
    }
  }

  throw new Error("Invalid history period")
}

const mapBetRow = (bet) => {
  return {
    id: bet.id,
    createdAt: bet.creat_la,
    settledAt: bet.inchis_la,
    match: bet.meci,
    betType: bet.pariu,
    odds: Number(bet.cota),
    stake: Number(bet.miza),
    betDetails: bet.pariu_concret,
    payout: Number(bet.suma_rezultat || 0),
    profitLoss: Number(bet.profit_pierdere || 0),
    result: bet.rezultat
  }
}

const calculateHistorySummary = (bets) => {
  const totalStake = bets.reduce((sum, bet) => sum + bet.stake, 0)
  const totalProfitLoss = bets.reduce((sum, bet) => sum + bet.profitLoss, 0)

  const roiPercentage =
    totalStake > 0 ? Number(((totalProfitLoss / totalStake) * 100).toFixed(2)) : 0

  return {
    totalBets: bets.length,
    totalStake: Number(totalStake.toFixed(2)),
    totalProfitLoss: Number(totalProfitLoss.toFixed(2)),
    roiPercentage
  }
}

export const getHistoryByPeriod = async (period) => {
  const { start, end } = getDateRangeByPeriod(period)

  const { data, error } = await supabase
    .from("pariuri_istoric")
    .select("*")
    .not("inchis_la", "is", null)
   .gte("inchis_la", start.toISOString())
    .lte("inchis_la", end.toISOString())
    .order("inchis_la", { ascending: false })
  if (error) {
    console.error("Get history by period error:", error)
    throw error
  }

  const bets = (data || []).map(mapBetRow)
  const summary = calculateHistorySummary(bets)

  return {
    period,
    dateRange: {
      start: start.toISOString(),
      end: end.toISOString()
    },
    summary,
    bets
  }
}