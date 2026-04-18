import { useEffect, useState } from "react"

function HistoryPage() {
  const [period, setPeriod] = useState("daily")
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState("")

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(
          `${API_URL}/api/history?period=${period}`
        )

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Eroare la încărcare")
        }

        setData(result.data)
      } catch (err) {
        setError("Nu s-a putut încărca istoricul.")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [period, API_URL])

  const getProfitColor = (value) => {
    if (value > 0) return "text-green-400"
    if (value < 0) return "text-red-400"
    return "text-gray-300"
  }

  const formatNumber = (num) => {
    return Number(num).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-8 text-center">
          Istoric Pariuri
        </h1>

        {/* TABS */}
        <div className="flex justify-center gap-4 mb-10">
          {["daily", "weekly", "monthly"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                period === p
                  ? "bg-blue-600"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {p === "daily" && "Zilnic"}
              {p === "weekly" && "Săptămânal"}
              {p === "monthly" && "Lunar"}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-300">
            Se încarcă istoricul...
          </p>
        )}

        {/* ERROR */}
        {!loading && error && (
          <p className="text-center text-red-400">{error}</p>
        )}

        {/* DATA */}
        {!loading && data && (
          <>
            {/* SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-center">

              <div className="bg-white/10 p-6 rounded-xl border border-white/10">
                <p className="text-gray-400 text-sm">Profit</p>
                <p className={`text-2xl font-bold ${getProfitColor(data.summary.totalProfitLoss)}`}>
                  {formatNumber(data.summary.totalProfitLoss)}
                </p>
              </div>

              <div className="bg-white/10 p-6 rounded-xl border border-white/10">
                <p className="text-gray-400 text-sm">ROI</p>
                <p className={`text-2xl font-bold ${getProfitColor(data.summary.roiPercentage)}`}>
                  {formatNumber(data.summary.roiPercentage)}%
                </p>
              </div>

              <div className="bg-white/10 p-6 rounded-xl border border-white/10">
                <p className="text-gray-400 text-sm">Pariuri</p>
                <p className="text-2xl font-bold">
                  {data.summary.totalBets}
                </p>
              </div>

            </div>

            {/* TABLE (doar pentru daily & weekly) */}
            {period !== "monthly" && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">

                  <thead>
                    <tr className="bg-white/10 text-left text-sm text-gray-300">
                      <th className="p-3">Meci</th>
                      <th className="p-3">Pariu</th>
                      <th className="p-3">Cotă</th>
                      <th className="p-3">Miză</th>
                      <th className="p-3">Rezultat</th>
                      <th className="p-3">Profit</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.bets.map((bet) => (
                      <tr
                        key={bet.id}
                        className="border-b border-white/10 hover:bg-white/5 transition"
                      >
                        <td className="p-3">{bet.match}</td>
                        <td className="p-3">{bet.betType}</td>
                        <td className="p-3">{bet.odds}</td>
                        <td className="p-3">{bet.stake}</td>
                        <td className="p-3 capitalize">
                          {bet.result.replace("_", " ")}
                        </td>
                        <td className={`p-3 font-semibold ${getProfitColor(bet.profitLoss)}`}>
                          {formatNumber(bet.profitLoss)}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default HistoryPage