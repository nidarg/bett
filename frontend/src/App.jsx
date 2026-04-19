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
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import TermsPage from "./pages/TermsPage"
import RiskPage from "./pages/RiskPage"
import CookiePage from "./pages/CookiePage"
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

        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
  <Route path="/terms-and-conditions" element={<TermsPage />} />
  <Route path="/risk-disclaimer" element={<RiskPage />} />
  <Route path="/cookie-policy" element={<CookiePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App