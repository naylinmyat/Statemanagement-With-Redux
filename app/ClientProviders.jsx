"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";

const ClientProviders = ({ children }) => {
    return (
        <ReduxProvider store={store}>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </ReduxProvider>
    )
}

export default ClientProviders