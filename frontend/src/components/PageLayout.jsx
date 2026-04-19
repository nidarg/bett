import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

function PageLayout({ maxWidth = "max-w-6xl" }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className={`${maxWidth} mx-auto px-6 py-8`}>
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}

export default PageLayout