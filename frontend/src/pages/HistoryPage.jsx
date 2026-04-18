import { useEffect, useState } from "react"
import ProfitChart from "../components/ProfitChart"

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

        const response = await fetch(`${API_URL}/api/history?period=${period}`)
        const rawText = await response.text()

        let result

        try {
          result = JSON.parse(rawText)
        } catch {
          throw new Error("Backend-ul nu a returnat JSON valid.")
        }

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Eroare la încărcarea istoricului.")
        }

        setData(result.data)
      } catch (err) {
        console.error("History fetch error:", err)
        setError(err.message || "Nu s-a putut încărca istoricul.")
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

  const getResultBadgeClasses = (result) => {
    if (result === "castigat") {
      return "bg-green-500/20 text-green-400 border border-green-400/20"
    }

    if (result === "pierdut") {
      return "bg-red-500/20 text-red-400 border border-red-400/20"
    }

    if (result === "in_asteptare") {
      return "bg-yellow-500/20 text-yellow-300 border border-yellow-400/20"
    }

    return "bg-gray-500/20 text-gray-300 border border-gray-400/20"
  }

  const formatCurrency = (value) => {
    const number = Number(value || 0)
    const sign = number > 0 ? "+" : ""
    return `${sign}${number.toFixed(0)} RON`
  }

  const formatPercentage = (value) => {
    const number = Number(value || 0)
    const sign = number > 0 ? "+" : ""
    return `${sign}${number.toFixed(2)}%`
  }

  const formatOdds = (value) => {
    return Number(value || 0).toFixed(2)
  }

  const formatDateLabel = (isoDate) => {
    if (!isoDate) return "-"

    return new Date(isoDate).toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  const periodLabels = {
    daily: "Zilnic",
    weekly: "Săptămânal",
    monthly: "Lunar"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Istoric Pariuri
          </h1>

          <p className="text-gray-300 max-w-2xl mx-auto">
            Vezi performanța pariurilor pe intervale zilnice, săptămânale și lunare,
            împreună cu profitul și randamentul calculat automat.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {["daily", "weekly", "monthly"].map((tab) => (
            <button
              key={tab}
              onClick={() => setPeriod(tab)}
              className={`px-5 py-2.5 rounded-lg font-semibold transition ${
                period === tab
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-white/10 hover:bg-white/20 border border-white/10"
              }`}
            >
              {periodLabels[tab]}
            </button>
          ))}
        </div>

        {loading && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-10 border border-white/10 text-center">
            <p className="text-gray-300 text-lg">Se încarcă istoricul...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-10 border border-red-400/20 text-center">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}

        {!loading && data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/10 text-center">
                <p className="text-gray-400 text-sm mb-2">Profit / Pierdere</p>
                <p className={`text-3xl font-bold ${getProfitColor(data.summary.totalProfitLoss)}`}>
                  {formatCurrency(data.summary.totalProfitLoss)}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/10 text-center">
                <p className="text-gray-400 text-sm mb-2">ROI</p>
                <p className={`text-3xl font-bold ${getProfitColor(data.summary.roiPercentage)}`}>
                  {formatPercentage(data.summary.roiPercentage)}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/10 text-center">
                <p className="text-gray-400 text-sm mb-2">Număr pariuri</p>
                <p className="text-3xl font-bold">
                  {data.summary.totalBets}
                </p>
              </div>
            </div>

            {period !== "monthly" && data.bets?.length > 0 && (
              <ProfitChart bets={data.bets} />
            )}

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    Istoric {periodLabels[period].toLowerCase()}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Interval: {formatDateLabel(data.dateRange?.start)} - {formatDateLabel(data.dateRange?.end)}
                  </p>
                </div>

                <div className="text-sm text-gray-300">
                  Miză totală:{" "}
                  <span className="font-semibold text-white">
                    {formatCurrency(data.summary.totalStake).replace("+", "")}
                  </span>
                </div>
              </div>
            </div>

            {period === "monthly" ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/10 text-center">
                <h3 className="text-2xl font-semibold mb-4">
                  Rezumat lunar
                </h3>

                <p className="text-gray-300 max-w-2xl mx-auto">
                  Pentru istoricul lunar afișăm doar profitul sau pierderea totală,
                  împreună cu randamentul procentual calculat automat pentru luna în curs.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto bg-white/10 backdrop-blur-lg rounded-xl border border-white/10">
                <table className="w-full border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-white/10 text-left text-sm text-gray-300">
                      <th className="p-4 font-semibold">Meci</th>
                      <th className="p-4 font-semibold">Pariu</th>
                      <th className="p-4 font-semibold">Cotă</th>
                      <th className="p-4 font-semibold">Miză</th>
                      <th className="p-4 font-semibold">Data închiderii</th>
                      <th className="p-4 font-semibold">Rezultat</th>
                      <th className="p-4 font-semibold">Profit / Pierdere</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.bets?.length ? (
                      data.bets.map((bet) => (
                        <tr
                          key={bet.id}
                          className="border-t border-white/10 hover:bg-white/5 transition"
                        >
                          <td className="p-4 align-top">
                            <p className="font-medium text-white">{bet.match}</p>
                          </td>

                          <td className="p-4 align-top">
                            <p className="text-gray-200">{bet.betType}</p>
                            {bet.betDetails && (
                              <p className="text-xs text-gray-400 mt-1">
                                {bet.betDetails}
                              </p>
                            )}
                          </td>

                          <td className="p-4 align-top text-gray-200">
                            {formatOdds(bet.odds)}
                          </td>

                          <td className="p-4 align-top text-gray-200">
                            {formatCurrency(bet.stake).replace("+", "")}
                          </td>

                          <td className="p-4 align-top text-gray-200">
                            {formatDateLabel(bet.settledAt)}
                          </td>

                          <td className="p-4 align-top">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getResultBadgeClasses(
                                bet.result
                              )}`}
                            >
                              {bet.result.replace("_", " ")}
                            </span>
                          </td>

                          <td className={`p-4 align-top font-semibold ${getProfitColor(bet.profitLoss)}`}>
                            {formatCurrency(bet.profitLoss)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-gray-400">
                          Nu există pariuri în această perioadă.
                        </td>
                      </tr>
                    )}
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