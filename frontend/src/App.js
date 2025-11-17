import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./components/Welcome";        // ← Add this
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";

function App() {
    const isAuthenticated = () => {
        return !!localStorage.getItem("token");
    };

    const ProtectedRoute = ({ children }) => {
        return isAuthenticated() ? children : <Navigate to="/login" />;
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Home page - shows Welcome if not logged in, Dashboard if logged in */}
                    <Route 
                        path="/" 
                        element={
                            isAuthenticated() ? <Navigate to="/dashboard" /> : <Welcome />
                        } 
                    />
                    
                    <Route path="/signup" element={<SignupForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;