import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"

function ActivationPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const [loading, setLoading] = useState(true)
  const [subscriber, setSubscriber] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const validateToken = async () => {
      try {
        if (!token) {
          setErrorMessage("Token lipsă.")
          setLoading(false)
          return
        }

        const response = await fetch(`${API_URL}/api/activate?token=${token}`)
        const result = await response.json()

        if (!response.ok || !result.success) {
          setErrorMessage(result.message || "Token invalid sau expirat.")
          setLoading(false)
          return
        }

        setSubscriber(result.subscriber)
        setLoading(false)
      } catch (error) {
        setErrorMessage("Nu s-a putut valida tokenul.")
        setLoading(false)
      }
    }

    validateToken()
  }, [token, API_URL])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-10 border border-white/10 text-center">

          {loading && (
            <>
              <h1 className="text-3xl font-bold mb-4">
                Verificăm activarea...
              </h1>
              <p className="text-gray-300">
                Te rugăm să aștepți câteva secunde.
              </p>
            </>
          )}

          {!loading && errorMessage && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center border border-red-400/30">
                <span className="text-3xl">!</span>
              </div>

              <h1 className="text-3xl font-bold mb-4">
                Activare eșuată
              </h1>

              <p className="text-red-300 mb-8">
                {errorMessage}
              </p>

              <Link
                to="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-semibold"
              >
                Înapoi la pagina principală
              </Link>
            </>
          )}

          {!loading && subscriber && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-400/30">
                <span className="text-3xl">✓</span>
              </div>

              <h1 className="text-3xl font-bold mb-4">
                Activare validă
              </h1>

              <p className="text-gray-300 mb-4">
                Contul asociat cu emailul de mai jos a fost validat cu succes:
              </p>

              <p className="text-blue-300 font-semibold mb-8">
                {subscriber.email}
              </p>

              <p className="text-gray-400 mb-8">
                În pasul următor vei conecta contul tău de Telegram pentru a primi acces la canalul privat.
              </p>

              <button
                className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-semibold"
              >
                Conectează Telegram
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default ActivationPage