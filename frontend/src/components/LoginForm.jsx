// import React, { useState } from "react";
// import { login, isVerified } from "../services/auth";
// import { useNavigate, Link } from "react-router-dom";

// const LoginForm = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         email: "",
//         password: "",
//     });
//     const [error, setError] = useState("");
//     const [warning, setWarning] = useState("");
//     const [loading, setLoading] = useState(false);

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setWarning(""); 
//         setLoading(true);

//         try {
//             const response = await login(formData);
//             console.log("Login successful:", response);

//             // Check if email is verified
//             if (!isVerified()) {
//                 setWarning("⚠️ Please verify your email. Check your inbox for the verification link.");
//                 // Still allow login but show warning
//             }

//             navigate("/dashboard"); // Redirect after successful login
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="login-container">
//             <h2>Login</h2>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="email"
//                     name="email"
//                     placeholder="Email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                 />
//                 <input
//                     type="password"
//                     name="password"
//                     placeholder="Password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     required
//                 />
                
//                 {error && <p className="error">{error}</p>}
                
//                 <button type="submit" disabled={loading}>
//                     {loading ? "Logging in..." : "Login"}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default LoginForm;
import React, { useState } from "react";
import { login, isVerified } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import "./CSS/Signupform.css"; // Use the same CSS

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [warning, setWarning] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setWarning("");
        setLoading(true);

        try {
            const response = await login(formData);
            console.log("Login successful:", response);

            if (!isVerified()) {
                setWarning("⚠️ Please verify your email. Check your inbox for the verification link.");
            }

            setSuccess(true);

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
    return (
        <div className="auth-bg">
            <div className="page-container">
                <div className="signup-container success-container">
                    <h2 className="success-title">✅ Login Successful!</h2>
                    {warning && <p className="success-message">{warning}</p>}
                    <p className="success-message">Redirecting to dashboard...</p>
                </div>
            </div>
        </div>
    );
}


    return (
    <div className="auth-bg">
        <div className="page-container">
            <div className="login-container">
                <h2 className="signup-title">Welcome Back!</h2>
                <form onSubmit={handleSubmit} className="signup-form">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />

                    {error && <p className="error-message">{error}</p>}
                    {warning && <p className="error-message">{warning}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-button"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p className="signup-link">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    </div>
);


};

export default LoginForm;
