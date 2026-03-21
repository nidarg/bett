function CancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/10 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto border border-yellow-400/30">
              <span className="text-3xl">!</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Plata a fost anulată
          </h1>

          <p className="text-gray-300 text-lg mb-6">
            Nu s-a finalizat nicio activare a trialului.
          </p>

          <p className="text-gray-400 mb-8">
            Poți reveni oricând pentru a începe trialul gratuit și a primi acces
            la ponturile live de pe Telegram.
          </p>

          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-semibold"
          >
            Înapoi la pagina principală
          </a>
        </div>
      </div>
    </div>
  )
}

export default CancelPage