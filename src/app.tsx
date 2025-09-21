import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing-page";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import Home from "./pages/home";
import { Toaster } from "sonner";

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="App">
      {user ? <Home /> : <LandingPage />}
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
