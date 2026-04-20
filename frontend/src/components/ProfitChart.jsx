import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

const groupByDay = (bets) => {
  const map = {}

  bets.forEach((bet) => {
    if (!bet.settledAt) return

    const date = new Date(bet.settledAt).toLocaleDateString("ro-RO", {
      timeZone: "Europe/Bucharest",
      day: "2-digit",
      month: "2-digit"
    })

    if (!map[date]) {
      map[date] = 0
    }

    map[date] += Number(bet.profitLoss || 0)
  })

  return map
}

const buildChartData = (bets) => {
  const grouped = groupByDay(bets)

  const sortedDates = Object.keys(grouped).sort((a, b) => {
    const [d1, m1] = a.split(".")
    const [d2, m2] = b.split(".")

    const dateA = new Date(2026, m1 - 1, d1)
    const dateB = new Date(2026, m2 - 1, d2)

    return dateA - dateB
  })

  let cumulative = 0

  return sortedDates.map((date) => {
    cumulative += grouped[date]

    return {
      date,
      profit: cumulative
    }
  })
}

function ProfitChart({ bets }) {
  const data = buildChartData(bets)
  const finalProfit = data[data.length - 1]?.profit || 0

const color = finalProfit >= 0 ? "#22c55e" : "#ef4444"

  if (!data.length) return null

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
      <h3 className="text-xl font-semibold mb-4">
        Evoluția profitului
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />

          <XAxis
            dataKey="date"
            stroke="#ccc"
          />

          <YAxis stroke="#ccc" />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151"
            }}
          />

          <Line
            type="monotone"
            dataKey="profit"
            stroke={color}
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ProfitChart