// React Imports
import React, { createContext, useContext, useEffect, useState } from 'react';

// Shopify Imports
import createApp from '@shopify/app-bridge';
import { getSessionToken } from '@shopify/app-bridge-utils';
import { useAppBridge } from '@shopify/app-bridge-react';

const SessionTokenContext = createContext(null); 

export const SessionTokenProvider = ({ children }) => {

    // Hooks
    const shopify = useAppBridge();

    // State
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const app = createApp({
            apiKey: shopify.config.apiKey,
            host: shopify.config.host,
            forceRedirect: true,
        });

        const fetchToken = async () => {
            try {
                const sessionToken = await getSessionToken(app);
                setToken(sessionToken);
            } catch (err) {
                console.error("Error getting session token:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchToken();

        const interval = setInterval(fetchToken, 3600000);
        return () => clearInterval(interval);
    }, [shopify]);

    if (loading) {
        return <div>Loading Shopify session...</div>;
    }

    return (
        <SessionTokenContext.Provider value={token}>
            {children}
        </SessionTokenContext.Provider>
    );
};

export const useSessionToken = () => useContext(SessionTokenContext);
