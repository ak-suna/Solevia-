import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { verifyEmail } from "../services/auth";

const VerifyEmail = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying"); // verifying | success | error
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await verifyEmail(code);
                setStatus("success");
                setMessage(response.message || "Email verified successfully");
                
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } catch (err) {
                setStatus("error");
                setMessage(err.message);
            }
        };

        verify();
    }, [code, navigate]);

    return (
        <div style={styles.container}>
            {status === "verifying" && (
                <div style={styles.card}>
                    <div style={styles.spinner}></div>
                    <h2>Verifying your email...</h2>
                </div>
            )}

            {status === "success" && (
                <div style={styles.card}>
                    <div style={styles.successIcon}>✅</div>
                    <h2>Email Verified!</h2>
                    <p>{message}</p>
                    <p>Redirecting to login...</p>
                    <Link to="/login" style={styles.link}>Go to Login Now</Link>
                </div>
            )}

            {status === "error" && (
                <div style={styles.card}>
                    <div style={styles.errorIcon}>❌</div>
                    <h2>Verification Failed</h2>
                    <p>{message}</p>
                    <Link to="/signup" style={styles.link}>Sign Up Again</Link>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
    },
    card: {
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        textAlign: "center",
        maxWidth: "400px",
    },
    spinner: {
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #3498db",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        animation: "spin 1s linear infinite",
        margin: "0 auto 20px",
    },
    successIcon: {
        fontSize: "60px",
        marginBottom: "20px",
    },
    errorIcon: {
        fontSize: "60px",
        marginBottom: "20px",
    },
    link: {
        display: "inline-block",
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        textDecoration: "none",
        borderRadius: "5px",
    },
};

export default VerifyEmail;