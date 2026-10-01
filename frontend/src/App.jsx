import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import OrganizationDonations from "./pages/OrganizationDonations";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizationRegister from "./pages/OrganizationRegister";
import OrganizerRegister from "./pages/OrganizerRegister";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/organization/donations"
          element={<OrganizationDonations />}
        />

        <Route
          path="/organizer/dashboard"
          element={<OrganizerDashboard />}
        />

        <Route
          path="/organization/register"
          element={<OrganizationRegister />}
        />

        <Route
          path="/organizer/register"
          element={<OrganizerRegister />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;