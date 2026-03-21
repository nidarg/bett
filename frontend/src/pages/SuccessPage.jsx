function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">

      <div className="max-w-3xl mx-auto px-6 py-24">

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-10 border border-white/10 text-center">

          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-400/30">
            <span className="text-3xl">✓</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Trial activat
          </h1>

          <p className="text-gray-300 text-lg mb-6">
            Plata a fost procesată cu succes și trialul tău gratuit a început.
          </p>

          <p className="text-gray-400 mb-10">
            În câteva momente vei primi instrucțiunile pentru accesul
            la canalul privat de Telegram unde sunt publicate ponturile live.
          </p>

          <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-8">

            <p className="text-gray-300 mb-2">
              Ce urmează:
            </p>

            <p className="text-gray-400 text-sm">
              1. Confirmăm activarea abonamentului
            </p>

            <p className="text-gray-400 text-sm">
              2. Generăm accesul către Telegram
            </p>

            <p className="text-gray-400 text-sm">
              3. Vei putea vedea ponturile live în timpul meciurilor
            </p>

          </div>

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

export default SuccessPage