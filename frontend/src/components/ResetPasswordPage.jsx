import React, { useState } from "react";
import { resetPassword } from "../services/auth";
import { useNavigate, useParams, Link } from "react-router-dom";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const { token } = useParams(); // Get token from URL
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);

        try {
            const response = await resetPassword(token, formData.password);
            console.log("Password reset successful:", response);
            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full mx-4 animate-fade-in">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Password Reset Successful!</h2>
                    <p className="text-gray-600 mb-6">
                        Your password has been updated. You can now log in with your new password.
                    </p>
                    <p className="text-sm text-gray-500">
                        Redirecting to login...
                    </p>
                    <div className="mt-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f1bdcd] via-[#f5d9c9] to-[#A7D5C4]">
            <div className="flex min-h-screen">
                {/* Left Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="max-w-md w-full animate-fade-in-left">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                                Reset Password
                            </h2>
                            <p className="text-gray-600 text-center mb-6">
                                Enter your new password below
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="New Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:border-indigo-300"
                                />

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm New Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:border-indigo-300"
                                />

                                {error && (
                                    <p className="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-lg animate-shake">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-10 py-4 text-xl bg-[#f096b3] text-white rounded-full font-semibold hover:bg-[#f8ba90] transition-all duration-300 hover:scale-105 shadow-xl"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Resetting...
                                        </span>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </button>
                            </form>

                            <p className="text-center text-gray-600 mt-6">
                                Remember your password?{" "}
                                <Link to="/login" className="text-[#759a68] hover:text-[#6ca859] font-semibold transition-colors duration-300 hover:underline">
                                    Back to Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Image */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <img 
                        src='/okay.png'
                        alt="Reset Password" 
                        className="w-full h-full object-cover animate-fade-in"
                    />
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes fade-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }

                .animate-fade-in-left {
                    animation: fade-in-left 0.8s ease-out;
                }

                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default ResetPasswordPage;