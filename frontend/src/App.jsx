import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizationDashboard from "./pages/OrganizationDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Login / Create Account */}
        <Route
          path="/auth"
          element={<Auth />}
        />

        {/* Organizer Dashboard */}
        <Route
          path="/organizer/dashboard"
          element={<OrganizerDashboard />}
        />

        {/* Organization Dashboard */}
        <Route
          path="/organization/dashboard"
          element={<OrganizationDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;