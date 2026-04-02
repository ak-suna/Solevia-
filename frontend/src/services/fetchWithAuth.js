// fetchWithAuth.js
// Universal fetch wrapper to handle disabled user logout
import { logout } from "./auth";

/**
 * Wrapper for fetch that logs out and redirects if user is disabled.
 * @param {string} url
 * @param {object} options
 * @param {function} onDisabled (optional) - callback with error message
 */
export async function fetchWithAuth(url, options = {}, onDisabled) {
    const res = await fetch(url, options);
    let data;
    try {
        data = await res.clone().json();
    } catch {
        data = null;
    }
    if (res.status === 403 && data && data.error && data.error.includes("disabled")) {
        // Remove token and redirect
        logout();
        if (onDisabled) {
            onDisabled(data.error, data.reason);
        } else {
            window.location.href = `/login?disabled=1&msg=${encodeURIComponent(data.error)}${data.reason ? `&reason=${encodeURIComponent(data.reason)}` : ""}`;
        }
        throw new Error(data.error);
    }
    return res;
}
