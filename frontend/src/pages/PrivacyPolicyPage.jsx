function PrivacyPolicyPage() {
  return (
    <div className="space-y-6 text-white leading-7">
      <h1 className="text-3xl font-bold">Politica de confidențialitate</h1>

      <p>
        Această politică explică modul în care colectăm, folosim și protejăm datele tale personale
        atunci când utilizezi serviciul BetSmartBetLive.
      </p>

      <h2 className="text-xl font-semibold">1. Date colectate</h2>
      <p>
        Colectăm următoarele date:
        <br />- Adresa de email
        <br />- Date legate de abonament (procesate prin Stripe)
        <br />- Date tehnice minime (loguri, securitate)
      </p>

      <h2 className="text-xl font-semibold">2. Scopul colectării</h2>
      <p>
        Datele sunt colectate pentru:
        <br />- activarea trialului gratuit
        <br />- gestionarea abonamentului
        <br />- oferirea accesului la canalul privat Telegram
        <br />- suport și securitate
      </p>

      <h2 className="text-xl font-semibold">3. Baza legală</h2>
      <p>
        Prelucrarea datelor se face în baza consimțământului tău și pentru executarea serviciului oferit.
      </p>

      <h2 className="text-xl font-semibold">4. Partajarea datelor</h2>
      <p>
        Datele pot fi partajate cu:
        <br />- Stripe (procesare plăți)
        <br />- Supabase (bază de date)
        <br />- furnizorul de hosting
      </p>

      <h2 className="text-xl font-semibold">5. Perioada de stocare</h2>
      <p>
        Datele sunt păstrate atât timp cât este necesar pentru furnizarea serviciului sau conform obligațiilor legale.
      </p>

      <h2 className="text-xl font-semibold">6. Drepturile tale</h2>
      <p>
        Ai dreptul la:
        <br />- acces la date
        <br />- rectificare
        <br />- ștergere
        <br />- restricționare
        <br />- portabilitate
      </p>

      <h2 className="text-xl font-semibold">7. Contact</h2>
      <p>
        Pentru orice solicitare legată de date:
        <br />
        <strong>bet_smart_bet_live@gmail.com</strong>
      </p>
    </div>
  )
}

export default PrivacyPolicyPage