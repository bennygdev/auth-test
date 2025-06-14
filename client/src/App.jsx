import { AuthProvider } from "./hooks/AuthContext";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthTestPage from "./pages/AuthTestPage";
import AuthCallback from "./pages/AuthCallback";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Protected Routes */}
              <Route 
                path="/authtest" 
                element={
                  <ProtectedRoute>
                    <AuthTestPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
