const stripTrailingSlash = (value) => value.replace(/\/$/, "");

export const getFrontendUrl = () => {
    return stripTrailingSlash(process.env.FRONTEND_URL || "https://solevia-frontendd.onrender.com");
};

export const getBackendUrl = () => {
    return stripTrailingSlash(process.env.BACKEND_URL || "https://solevia-backend.onrender.com");
};