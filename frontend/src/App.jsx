import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SuccessPage from "./pages/SuccessPage"
import CancelPage from "./pages/CancelPage"
import ActivationPage from "./pages/ActivationPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/activate" element={<ActivationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App