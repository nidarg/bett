import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"

const MAX_RETRIES = 5
const RETRY_DELAY_MS = 2000

function SuccessPage() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const [loading, setLoading] = useState(true)
  const [activationToken, setActivationToken] = useState("")
  const [subscriber, setSubscriber] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [attempt, setAttempt] = useState(1)

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    let timeoutId

    const getActivationData = async (retryCount = 1) => {
      try {
        if (!sessionId) {
          setErrorMessage("Lipsește session_id din URL.")
          setLoading(false)
          return
        }

        console.log(`Activation fetch attempt ${retryCount}/${MAX_RETRIES}`)

        const response = await fetch(
          `${API_URL}/api/checkout-session?session_id=${sessionId}`
        )

        const result = await response.json()

        if (response.ok && result.success && result.activationToken) {
          setActivationToken(result.activationToken)
          setSubscriber(result.subscriber)
          setLoading(false)
          return
        }

        if (retryCount < MAX_RETRIES) {
          setAttempt(retryCount + 1)

          timeoutId = setTimeout(() => {
            getActivationData(retryCount + 1)
          }, RETRY_DELAY_MS)

          return
        }

        setErrorMessage(
          result.message ||
            "Nu am putut obține datele de activare. Te rugăm să reîncerci."
        )
        setLoading(false)
      } catch (error) {
        if (retryCount < MAX_RETRIES) {
          setAttempt(retryCount + 1)

          timeoutId = setTimeout(() => {
            getActivationData(retryCount + 1)
          }, RETRY_DELAY_MS)

          return
        }

        setErrorMessage("Nu s-a putut conecta la server.")
        setLoading(false)
      }
    }

    getActivationData()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [sessionId, API_URL])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-10 border border-white/10 text-center">
          {loading && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/30">
                <span className="text-3xl">⏳</span>
              </div>

              <h1 className="text-4xl font-bold mb-4">
                Procesăm activarea...
              </h1>

              <p className="text-gray-300 mb-3">
                Confirmăm abonamentul și pregătim accesul către Telegram.
              </p>

              <p className="text-sm text-gray-400">
                Încercarea {attempt} din {MAX_RETRIES}
              </p>
            </>
          )}

          {!loading && errorMessage && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center border border-red-400/30">
                <span className="text-3xl">!</span>
              </div>

              <h1 className="text-4xl font-bold mb-4">
                Activare incompletă
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

          {!loading && activationToken && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-400/30">
                <span className="text-3xl">✓</span>
              </div>

              <h1 className="text-4xl font-bold mb-4">
                Trial activat
              </h1>

              <p className="text-gray-300 text-lg mb-4">
                Plata a fost procesată cu succes și trialul tău gratuit a început.
              </p>

              {subscriber?.email && (
                <p className="text-blue-300 font-semibold mb-6">
                  {subscriber.email}
                </p>
              )}

              <p className="text-gray-400 mb-8">
                Următorul pas este conectarea contului Telegram pentru accesul la canalul privat.
              </p>

              <Link
                to={`/activate?token=${activationToken}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-semibold"
              >
                Continuă activarea
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SuccessPage