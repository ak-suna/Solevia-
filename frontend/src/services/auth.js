import { jwtDecode } from "jwt-decode"; // ✅ correct for v3+

const API_URL = "http://localhost:5000/api/users";
export const signup = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        console.log("Backend response:", data); // ← This shows the exact backend error

        if (!response.ok) {
            throw new Error(data.error || "Signup failed");
        }

        // Store token (user can browse but should verify email)
        localStorage.setItem("token", data.token);

        return data;
    } catch (err) {
        console.error("Signup error:", err.message);
        throw err; // rethrow so frontend form can handle it
    }
};

// export const signup = async (userData) => {
//     const response = await fetch(`${API_URL}/signup`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//         throw new Error(data.error || "Signup failed");
//     }
//     // Store token (user can browse but should verify email)
//     localStorage.setItem("token", data.token);

//     return data;
// };

export const login = async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Login failed");
    }

    // ✅ Only store token on login
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role); // NEW
    localStorage.setItem("isVerified", data.isVerified);
    // const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const decoded = jwtDecode(data.token);
    const username = `${decoded.firstName || ""} `.trim();
    localStorage.setItem("username", username);
    return data;
};
//Verify Email Function
export const verifyEmail = async (code) => {
    const response = await fetch(`${API_URL}/verify-email/${code}`, {
        method: "GET",
    });

    const data = await response.json();

    if (response.ok || data.success || data.message?.toLowerCase().includes("already verified")) {
        return data;
    } else {
        throw new Error(data.error || "Email verification failed");
    }

    // if (!response.ok) {
    //     throw new Error(data.error || "Email verification failed");
    // }

    // return data;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // NEW
    localStorage.removeItem("isVerified");
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getRole = () => {
    return localStorage.getItem("role");
};

export const isVerified = () => {
    return localStorage.getItem("isVerified") === "true";
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
    // const token = localStorage.getItem("token"); 
    // const verified = localStorage.getItem("verified"); // set this after email verification
    // return !!token && verified === "true";
};

export const isAdmin = () => {
    return localStorage.getItem("role") === "admin";
};

export const getUsername = () => {
  return localStorage.getItem("username");
};



