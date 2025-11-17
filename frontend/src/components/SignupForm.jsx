import React, { useState } from "react";
import { signup } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import "./CSS/Signupform.css";
// import landingBG from "../assets/images/l.png"; 

const SignupForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Password match validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await signup(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="signup-container success-container"
            >
                <h2 className="success-title">✅ Signup Successful!</h2>
                <p className="success-message">Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="signup-container">
            <h2 className="signup-title">Sign Up</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="form-input"
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="form-input"
                />
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
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="form-input"
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="form-input"
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="form-input"
                />

                {error && <p className="error-message">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="submit-button"
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>
            <p className="login-link">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default SignupForm;