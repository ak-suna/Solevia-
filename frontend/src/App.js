// // import React from "react";
// // import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// // import Welcome from "./components/Welcome";        // ← Add this
// // import SignupForm from "./components/SignupForm";
// // import LoginForm from "./components/LoginForm";
// // import Dashboard from "./components/Dashboard";
// // import VerifyEmail from "./components/VerifyEmail"; // NEW
// // import { isAuthenticated, isAdmin } from "./services/auth"; 

// // function App() {
// //     const isAuthenticated = () => {
// //         return !!localStorage.getItem("token");
// //     };

// //     const ProtectedRoute = ({ children }) => {
// //         return isAuthenticated() ? children : <Navigate to="/login" />;
// //     };

// //     return (
// //         <Router>
// //             <div className="App">
// //                 <Routes>
// //                     {/* Home page - shows Welcome if not logged in, Dashboard if logged in */}
// //                     <Route 
// //                         path="/" 
// //                         element={
// //                             isAuthenticated() ? <Navigate to="/dashboard" /> : <Welcome />
// //                         } 
// //                     />
                    
// //                     <Route path="/signup" element={<SignupForm />} />
// //                     <Route path="/login" element={<LoginForm />} />
                    
// //                     <Route
// //                         path="/dashboard"
// //                         element={
// //                             <ProtectedRoute>
// //                                 <Dashboard />
// //                             </ProtectedRoute>
// //                         }
// //                     />
// //                 </Routes>
// //             </div>
// //         </Router>
// //     );
// // }

// // // export default App;
// // import React from "react";
// // import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// // import Welcome from "./components/Welcome";
// // import SignupForm from "./components/SignupForm";
// // import LoginForm from "./components/LoginForm";
// // import Dashboard from "./components/Dashboard";
// // import VerifyEmail from "./components/VerifyEmail"; // NEW
// // import { isAuthenticated, isAdmin } from "./services/auth"; // UPDATED

// // function App() {
// //     const ProtectedRoute = ({ children }) => {
// //         return isAuthenticated() ? children : <Navigate to="/login" />;
// //     };

// //     const AdminRoute = ({ children }) => {
// //         if (!isAuthenticated()) {
// //             return <Navigate to="/login" />;
// //         }
// //         if (!isAdmin()) {
// //             return <Navigate to="/dashboard" />;
// //         }
// //         return children;
// //     };

// //     return (
// //         <Router>
// //             <div className="App">
// //                 <Routes>
// //                     <Route 
// //                         path="/" 
// //                         element={
// //                             isAuthenticated() ? <Navigate to="/dashboard" /> : <Welcome />
// //                         } 
// //                     />
                    
// //                     <Route path="/signup" element={<SignupForm />} />
// //                     <Route path="/login" element={<LoginForm />} />
                    
// //                     {/* NEW - Email Verification Route */}
// //                     <Route path="/verify-email/:code" element={<VerifyEmail />} />
                    
// //                     <Route
// //                         path="/dashboard"
// //                         element={
// //                             <ProtectedRoute>
// //                                 <Dashboard />
// //                             </ProtectedRoute>
// //                         }
// //                     />

// //                     {/* Example Admin-Only Route */}
// //                     {/* <Route
// //                         path="/admin"
// //                         element={
// //                             <AdminRoute>
// //                                 <AdminPanel />
// //                             </AdminRoute>
// //                         }
// //                     /> */}
// //                 </Routes>
// //             </div>
// //         </Router>
// //     );
// // }

// // export default App;

// //works well before the theme part
// // import React from "react";
// // import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// // import Welcome from "./pages/Welcome";
// // import SignupForm from "./auth/SignupForm";
// // import LoginForm from "./auth/LoginForm";
// // import Dashboard from "./pages/Dashboard"; // redirect-only dashboard
// // import UserDashboard from "./pages/UserDashboard"; // NEW
// // import AdminDashboard from "./pages/AdminDashboard"; // your admin dashboard
// // import VerifyEmail from "./auth/VerifyEmail";
// // import { isAuthenticated, isAdmin } from "./services/auth";
// // import ForgotPasswordPage from "./components/ForgotPasswordPage";
// // import ResetPasswordPage from "./components/ResetPasswordPage";
// // // import { Sidebar } from './components/Sidebar';
// // // import { HabitsCard } from './components/HabitsCard';
// // // import { GoalsCard } from './components/GoalsCard';
// // // import { Search, Bell, Menu, Flame } from 'lucide-react';
// // import Journal from './pages/Journal';

// // // import { TryComponent } from "./components/TryComponent";
// // // import moodRoutes from "../backend/routes/moodRoutes";

// // function App() {
// //     const ProtectedRoute = ({ children }) => {
// //         return isAuthenticated() ? children : <Navigate to="/login" />;
// //     };

// //     const AdminRoute = ({ children }) => {
// //         if (!isAuthenticated()) return <Navigate to="/login" />;
// //         if (!isAdmin()) return <Navigate to="/user/dashboard" />;
// //         return children;
// //     };

// //     return (
// //         <Router>
// //             <div className="App">
// //                 <Routes>
// //                     {/* Welcome / Landing */}
// //                     <Route path="/" element={<Welcome />} />


// //                     {/* Auth */}
// //                     <Route path="/signup" element={<SignupForm />} />
// //                     <Route path="/login" element={<LoginForm />} />
// //                     <Route path="/verify-email/:code" element={<VerifyEmail />} />

// //                     {/* Shared dashboard redirect */}
// //                     <Route
// //                         path="/dashboard"
// //                         element={
// //                             <ProtectedRoute>
// //                                 <Dashboard />  {/* redirects to /admin/dashboard or /user/dashboard */}
// //                             </ProtectedRoute>
// //                         }
// //                     />

// //                     {/* USER DASHBOARD */}
// //                     <Route
// //                         path="/user/dashboard"
// //                         element={
// //                             <ProtectedRoute>
// //                                 <UserDashboard />
// //                             </ProtectedRoute>
// //                         }
// //                     />

// //                     {/* ADMIN DASHBOARD */}
// //                     <Route
// //                         path="/admin/dashboard"
// //                         element={
// //                             <AdminRoute>
// //                                 <AdminDashboard />
// //                             </AdminRoute>
// //                         }
// //                     />
// //                     <Route 
// //                     path="/journal" 
// //                     element={
// //                     <Journal />} />

// //                     <Route 
// //                 path="/forgot-password" element={<ForgotPasswordPage />} />
// // <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
// //                 </Routes>
                
// //             </div>
// //         </Router>
// //     );
// // }

// // export default App;
// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Welcome from "./pages/Welcome";
// import SignupForm from "./auth/SignupForm";
// import LoginForm from "./auth/LoginForm";
// import Dashboard from "./pages/Dashboard";
// import UserDashboard from "./pages/UserDashboard";
// import AdminDashboard from "./pages/AdminDashboard";
// import VerifyEmail from "./auth/VerifyEmail";
// import { isAuthenticated, isAdmin } from "./services/auth";
// import ForgotPasswordPage from "./components/ForgotPasswordPage";
// import ResetPasswordPage from "./components/ResetPasswordPage";
// import Journal from './pages/Journal';
// import ThemedLayout from "./layouts/ThemedLayout"; // ADD THIS
// import SettingsPage from "./pages/SettingsPage"; // or wherever your SettingsPage is


// function App() {
//     const ProtectedRoute = ({ children }) => {
//         return isAuthenticated() ? children : <Navigate to="/login" />;
//     };

//     const AdminRoute = ({ children }) => {
//         if (!isAuthenticated()) return <Navigate to="/login" />;
//         if (!isAdmin()) return <Navigate to="/user/dashboard" />;
//         return children;
//     };

//     return (
//         <Router>
//             <div className="App">
//                 <Routes>
//                     {/* PUBLIC ROUTES - NO DARK MODE */}
//                     <Route path="/" element={<Welcome />} />
//                     <Route path="/signup" element={<SignupForm />} />
//                     <Route path="/login" element={<LoginForm />} />
//                     <Route path="/verify-email/:code" element={<VerifyEmail />} />
//                     <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//                     <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

//                     {/* REDIRECT DASHBOARD */}
//                     <Route
//                         path="/dashboard"
//                         element={
//                             <ProtectedRoute>
//                                 <Dashboard />
//                             </ProtectedRoute>
//                         }
//                     />

//                     {/* PROTECTED ROUTES WITH DARK MODE */}
//                     <Route
//                         path="/user/dashboard"
//                         element={
//                             <ProtectedRoute>
//                                 <ThemedLayout>
//                                     <UserDashboard />
//                                 </ThemedLayout>
//                             </ProtectedRoute>
//                         }
//                     />

//                     <Route
//                         path="/journal"
//                         element={
//                             <ProtectedRoute>
//                                 <ThemedLayout>
//                                     <Journal />
//                                 </ThemedLayout>
//                             </ProtectedRoute>
//                         }
//                     />

//                     <Route
//                         path="/admin/dashboard"
//                         element={
//                             <AdminRoute>
//                                 <ThemedLayout>
//                                     <AdminDashboard />
//                                 </ThemedLayout>
//                             </AdminRoute>
//                         }
//                     />

//                     {/* Future routes with dark mode */}
//                     {/* 
//                     <Route path="/settings" element={
//                         <ProtectedRoute>
//                             <ThemedLayout><Settings /></ThemedLayout>
//                         </ProtectedRoute>
//                     } />
//                     <Route path="/habits" element={
//                         <ProtectedRoute>
//                             <ThemedLayout><Habits /></ThemedLayout>
//                         </ProtectedRoute>
//                     } />
//                     <Route path="/goals" element={
//                         <ProtectedRoute>
//                             <ThemedLayout><Goals /></ThemedLayout>
//                         </ProtectedRoute>
//                     } />
//                     */}
//                 </Routes>
//             </div>
//         </Router>
//     );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import SignupForm from "./auth/SignupForm";
import LoginForm from "./auth/LoginForm";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import VerifyEmail from "./auth/VerifyEmail";
import { isAuthenticated, isAdmin } from "./services/auth";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import Journal from './pages/Journal';
import ThemedLayout from "./layouts/ThemedLayout";
import SettingsPage from "./pages/SettingsPage"; // ALREADY ADDED ✅

function App() {
    const ProtectedRoute = ({ children }) => {
        return isAuthenticated() ? children : <Navigate to="/login" />;
    };

    const AdminRoute = ({ children }) => {
        if (!isAuthenticated()) return <Navigate to="/login" />;
        if (!isAdmin()) return <Navigate to="/user/dashboard" />;
        return children;
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* PUBLIC ROUTES - NO DARK MODE */}
                    <Route path="/" element={<Welcome />} />
                    <Route path="/signup" element={<SignupForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/verify-email/:code" element={<VerifyEmail />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                    {/* REDIRECT DASHBOARD */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* PROTECTED ROUTES WITH DARK MODE */}
                    <Route
                        path="/user/dashboard"
                        element={
                            <ProtectedRoute>
                                <ThemedLayout>
                                    <UserDashboard />
                                </ThemedLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/journal"
                        element={
                            <ProtectedRoute>
                                <ThemedLayout>
                                    <Journal />
                                </ThemedLayout>
                            </ProtectedRoute>
                        }
                    />

                    {/* SETTINGS PAGE - ADD THIS */}
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <ThemedLayout>
                                    <SettingsPage />
                                </ThemedLayout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/dashboard"
                        element={
                            <AdminRoute>
                                <ThemedLayout>
                                    <AdminDashboard />
                                </ThemedLayout>
                            </AdminRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;