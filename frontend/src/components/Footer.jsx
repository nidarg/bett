import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 pt-8 pb-4 text-sm text-gray-400">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} BetSmartBetLive. Toate drepturile rezervate.
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-4 text-center">
          <Link to="/privacy-policy" className="hover:text-white transition">
            Politica de confidențialitate
          </Link>

          <Link to="/terms-and-conditions" className="hover:text-white transition">
            Termeni și condiții
          </Link>

          <Link to="/risk-disclaimer" className="hover:text-white transition">
            Avertisment risc
          </Link>

          <Link to="/cookie-policy" className="hover:text-white transition">
            Politica de cookie-uri
          </Link>
        </nav>
      </div>
    </footer>
  )
}

export default Footer