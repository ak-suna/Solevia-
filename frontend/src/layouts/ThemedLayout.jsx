import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";

export default function ThemedLayout({ children }) {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
                {children}
            </div>
        </ThemeProvider>
    );
}