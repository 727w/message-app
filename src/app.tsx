import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import { AuthProvider, useAuth } from "./contexts/auth-context";

const AppContent = () => {
  const { user } = useAuth();

  // return (
  //   <div className="App">
  //     {user ? <DiscordApp /> : <Home />}
  //     <Toaster />
  //   </div>
  // );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
