// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Welcome from "./components/Welcome";        // ← Add this
// import SignupForm from "./components/SignupForm";
// import LoginForm from "./components/LoginForm";
// import Dashboard from "./components/Dashboard";
// import VerifyEmail from "./components/VerifyEmail"; // NEW
// import { isAuthenticated, isAdmin } from "./services/auth"; 

// function App() {
//     const isAuthenticated = () => {
//         return !!localStorage.getItem("token");
//     };

//     const ProtectedRoute = ({ children }) => {
//         return isAuthenticated() ? children : <Navigate to="/login" />;
//     };

//     return (
//         <Router>
//             <div className="App">
//                 <Routes>
//                     {/* Home page - shows Welcome if not logged in, Dashboard if logged in */}
//                     <Route 
//                         path="/" 
//                         element={
//                             isAuthenticated() ? <Navigate to="/dashboard" /> : <Welcome />
//                         } 
//                     />
                    
//                     <Route path="/signup" element={<SignupForm />} />
//                     <Route path="/login" element={<LoginForm />} />
                    
//                     <Route
//                         path="/dashboard"
//                         element={
//                             <ProtectedRoute>
//                                 <Dashboard />
//                             </ProtectedRoute>
//                         }
//                     />
//                 </Routes>
//             </div>
//         </Router>
//     );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./components/Welcome";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import VerifyEmail from "./components/VerifyEmail"; // NEW
import { isAuthenticated, isAdmin } from "./services/auth"; // UPDATED

function App() {
    const ProtectedRoute = ({ children }) => {
        return isAuthenticated() ? children : <Navigate to="/login" />;
    };

    const AdminRoute = ({ children }) => {
        if (!isAuthenticated()) {
            return <Navigate to="/login" />;
        }
        if (!isAdmin()) {
            return <Navigate to="/dashboard" />;
        }
        return children;
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            isAuthenticated() ? <Navigate to="/dashboard" /> : <Welcome />
                        } 
                    />
                    
                    <Route path="/signup" element={<SignupForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    
                    {/* NEW - Email Verification Route */}
                    <Route path="/verify-email/:code" element={<VerifyEmail />} />
                    
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Example Admin-Only Route */}
                    {/* <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminPanel />
                            </AdminRoute>
                        }
                    /> */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;