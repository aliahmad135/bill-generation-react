import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HouseRegistration from "./pages/HouseRegistration";
import BillManagement from "./pages/BillManagement";
import FineManagement from "./pages/FineManagement";
import HouseListing from "./pages/HouseListing";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";

function App() {
  // This is just a mockup, so we'll create routes for visual representation
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="house-registration" element={<HouseRegistration />} />
            <Route path="bill-management" element={<BillManagement />} />
            <Route path="fine-management" element={<FineManagement />} />
            <Route path="house-listing" element={<HouseListing />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
