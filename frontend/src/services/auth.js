const API_URL = "http://localhost:5000/api/users";

export const signup = async (userData) => {
    const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Signup failed");
    }

    // ❌ REMOVED: localStorage.setItem("token", data.token);
    // Don't store token on signup - make them login
    
    return data;
};

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
    return data;
};

export const logout = () => {
    localStorage.removeItem("token");
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};


