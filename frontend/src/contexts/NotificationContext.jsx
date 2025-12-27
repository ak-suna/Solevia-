// frontend/src/contexts/NotificationContext.jsx
import React, { createContext, useContext } from "react";
import { useNotifications } from "../hooks/useNotifications";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const notificationData = useNotifications();

    return (
        <NotificationContext.Provider value={notificationData}>
            {children}
        </NotificationContext.Provider>
    );
}

// Custom hook to use notifications anywhere in your app
export function useNotificationContext() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotificationContext must be used within NotificationProvider");
    }
    return context;
}