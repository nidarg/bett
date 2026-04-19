import { BrowserRouter, Routes, Route } from "react-router-dom"
import PageLayout from "./components/PageLayout"
import HomePage from "./pages/HomePage"
import SuccessPage from "./pages/SuccessPage"
import CancelPage from "./pages/CancelPage"
import ActivationPage from "./pages/ActivationPage"
import HistoryPage from "./pages/HistoryPage"
import OpiniePage from "./pages/OpiniePage"
import StrategiePage from "./pages/StrategiePage"
import ContactPage from "./pages/ContactPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/opinie" element={<OpiniePage />} />
          <Route path="/strategie" element={<StrategiePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/activate" element={<ActivationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App