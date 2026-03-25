import { useForm } from "react-hook-form"
import { useState } from "react"

function HomePage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const API_URL = import.meta.env.VITE_API_URL

  const onSubmit = async (data) => {

    try {
      setLoading(true)
      setErrorMessage("")

      const response = await fetch(`${API_URL}/api/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok || !result.url) {
        setErrorMessage(result.message || "A apărut o eroare. Încearcă din nou.")
        setLoading(false)
        return
      }

      window.location.href = result.url
    } catch (error) {
      setErrorMessage("Nu s-a putut conecta la server.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-center mb-6">
          Live Betting Insights
        </h1>

        <p className="text-center text-gray-300 mb-16 text-lg">
          Analize sportive și ponturi live direct pe Telegram.
          Vezi în timp real pariurile pe care le plasăm și decide
          dacă vrei să le urmezi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-center">
          <div className="bg-white/10 p-6 rounded-xl border border-white/10">
            <p className="text-3xl font-bold">1200+</p>
            <p className="text-gray-400 text-sm">Ponturi analizate</p>
          </div>

          <div className="bg-white/10 p-6 rounded-xl border border-white/10">
            <p className="text-3xl font-bold">300+</p>
            <p className="text-gray-400 text-sm">Membri activi</p>
          </div>

          <div className="bg-white/10 p-6 rounded-xl border border-white/10">
            <p className="text-3xl font-bold">Live</p>
            <p className="text-gray-400 text-sm">Analize în timpul meciurilor</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 mb-16 border border-white/10">
          <h2 className="text-2xl font-semibold mb-6">
            Cum funcționează
          </h2>

          <p className="text-gray-300 mb-2">
            1. Introdu adresa ta de email.
          </p>

          <p className="text-gray-300 mb-2">
            2. Activează trialul gratuit de 7 zile.
          </p>

          <p className="text-gray-300 mb-2">
            3. Primești acces la canalul privat de Telegram.
          </p>

          <p className="text-gray-300">
            4. În timpul meciurilor vei vedea ponturile și analizele live.
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-8 mb-16 border border-white/10">
          <h2 className="text-2xl font-semibold mb-6">
            Întrebări frecvente
          </h2>

          <div className="mb-4">
            <p className="font-semibold">Cum primesc ponturile?</p>
            <p className="text-gray-300 text-sm">
              După activarea trialului vei primi acces la canalul privat de Telegram.
            </p>
          </div>

          <div className="mb-4">
            <p className="font-semibold">Trebuie să pariez?</p>
            <p className="text-gray-300 text-sm">
              Nu. Serviciul oferă doar analiză și informații. Decizia de a paria îți aparține.
            </p>
          </div>

          <div>
            <p className="font-semibold">Pot anula abonamentul?</p>
            <p className="text-gray-300 text-sm">
              Da, abonamentul poate fi anulat oricând din platforma de plată.
            </p>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-400 rounded-xl p-6 mb-16">
          <h3 className="font-semibold mb-2 text-yellow-300">
            Responsible Gambling
          </h3>

          <p className="text-sm text-gray-300">
            Pariurile sportive implică risc financiar și pot crea dependență.
            Acest serviciu oferă doar analiză și informații sportive.
            Nu garantăm profituri. Serviciul este destinat persoanelor peste 18 ani.
            Pariază responsabil.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/10">
          <h2 className="text-xl font-semibold mb-4">
            Începe trialul gratuit
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="email"
              placeholder="Adresa ta de email"
              className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 mb-2 focus:outline-none focus:border-blue-400"
              {...register("email", {
                required: "Emailul este obligatoriu",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email invalid"
                }
              })}
            />

            {errors.email && (
              <p className="text-red-400 text-sm mb-2">
                {errors.email.message}
              </p>
            )}

            {errorMessage && (
              <p className="text-red-400 text-sm mb-3">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Se încarcă..." : "Start Free Trial"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default HomePage