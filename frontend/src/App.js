
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
// import ThemedLayout from "./layouts/ThemedLayout";
// import SettingsPage from "./pages/SettingsPage"; // ALREADY ADDED ✅
// import HabitsPage from "./pages/HabitsPage"; // ADD THIS
// import GoalsPage from "./pages/GoalsPage"; // ADD THIS
// import { HabitsProvider } from './contexts/HabitsContext';
// import { GoalsProvider } from './contexts/GoalsContext';


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
//             <HabitsProvider>
//                 <GoalsProvider>
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

//                     {/* SETTINGS PAGE - ADD THIS */}
//                     <Route
//                         path="/settings"
//                         element={
//                             <ProtectedRoute>
//                                 <ThemedLayout>
//                                     <SettingsPage />
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
//                     <Route path="/tasks" element={<HabitsPage />} />
// <Route path="/goals" element={<GoalsPage />} />
//                 </Routes>
//             </div>
//             </GoalsProvider>
//             </HabitsProvider>
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
import SettingsPage from "./pages/SettingsPage";
import HabitsPage from "./pages/HabitsPage";
import GoalsPage from "./pages/GoalsPage";
import { HabitsProvider } from './contexts/HabitsContext';
import { GoalsProvider } from './contexts/GoalsContext';
import { NotificationProvider } from './contexts/NotificationContext'; // ← ADD THIS

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
            {/* ← WRAP EVERYTHING IN NotificationProvider */}
            <NotificationProvider>
                <HabitsProvider>
                    <GoalsProvider>
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

                                <Route 
                                    path="/tasks" 
                                    element={
                                        <ProtectedRoute>
                                            <ThemedLayout>
                                                <HabitsPage />
                                            </ThemedLayout>
                                        </ProtectedRoute>
                                    } 
                                />

                                <Route 
                                    path="/goals" 
                                    element={
                                        <ProtectedRoute>
                                            <ThemedLayout>
                                                <GoalsPage />
                                            </ThemedLayout>
                                        </ProtectedRoute>
                                    } 
                                />
                            </Routes>
                        </div>
                    </GoalsProvider>
                </HabitsProvider>
            </NotificationProvider>
        </Router>
    );
}

export default App;