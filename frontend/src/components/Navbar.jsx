import { Link, useLocation } from "react-router-dom"

function Navbar() {
  const location = useLocation()

  const navItems = [
    { label: "Opinie", to: "/opinie" },
    { label: "Strategie", to: "/strategie" },
    { label: "Istoric", to: "/history" },
    { label: "Contact", to: "/contact" }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
      <Link to="/" className="text-2xl font-bold">
        BetSmartBetLive
      </Link>

      <nav className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`transition ${
              isActive(item.to)
                ? "text-white font-semibold"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

export default Navbar