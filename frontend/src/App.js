// src/App.js
import { ThemeProvider } from "@mui/material/styles";
import DiscussifyHome from "./pages/DiscussifyHome";
import theme from "./theme";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import UserDashboard from "./pages/UserDashboard";
import RegistrationComponent from "./pages/RegistrationPage";
import Navbar from "./components/Navbar";
import AppFooter from "./components/AppFooter";
import AdminPanel from "./pages/AdminPanel";
import { useState } from "react";

function AppContent() {
  //theme...........................
  const [mode, setMode] = useState("dark");

  const handleModeChange = () => {
    setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
  };
  //..................................................
  const location = useLocation();
  const hideNavAndFooter =
    location.pathname === "/user" || location.pathname === "/admin";

  return (
    <>
      {!hideNavAndFooter && (
        <Navbar mode={mode} onModeChange={handleModeChange} />
      )}
      <Routes>
        <Route path="/" element={<DiscussifyHome mode={mode} />} />
        <Route
          path="/register"
          element={<RegistrationComponent mode={mode} />}
        />
        <Route path="/login" element={<LoginPage mode={mode} />} />
        <Route path="/user" element={<UserDashboard mode={mode} />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFoundPage mode={mode} />} />
      </Routes>
      {!hideNavAndFooter && <AppFooter />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
