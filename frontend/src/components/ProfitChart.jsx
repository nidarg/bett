import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

const formatChartData = (bets) => {
  let cumulative = 0

  return bets
    .slice()
    .reverse() // ca să fie cronologic
    .map((bet, index) => {
      cumulative += bet.profitLoss

      return {
        index: index + 1,
        profit: Number(cumulative.toFixed(2)),
        date: bet.settledAt
      }
    })
}

const formatCurrency = (value) => {
  const sign = value > 0 ? "+" : ""
  return `${sign}${Number(value).toFixed(0)}`
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null

  const value = payload[0].value

  return (
    <div className="bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-sm">
      <p className="text-gray-400">Profit acumulat</p>
      <p className={`font-semibold ${value >= 0 ? "text-green-400" : "text-red-400"}`}>
        {formatCurrency(value)} RON
      </p>
    </div>
  )
}

function ProfitChart({ bets }) {
  const data = formatChartData(bets)

  const isPositive = data.length > 0 && data[data.length - 1].profit >= 0

  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/10 mb-10">
      
      {/* HEADER */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold mb-1">
          Evoluție Profit
        </h2>
        <p className="text-gray-400 text-sm">
          Profit cumulativ în funcție de pariuri
        </p>
      </div>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#2a2a2a"
          />

          <XAxis
            dataKey="index"
            stroke="#888"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            stroke="#888"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}`}
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="profit"
            stroke={isPositive ? "#22c55e" : "#ef4444"}
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ProfitChart