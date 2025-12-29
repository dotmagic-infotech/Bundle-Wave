// React Imports
import { createContext, useContext, useEffect, useState, useRef } from 'react';

// Shopify Imports
import createApp from '@shopify/app-bridge';
import { getSessionToken } from '@shopify/app-bridge-utils';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Spinner } from '@shopify/polaris';

const SessionTokenContext = createContext(null);

export const SessionTokenProvider = ({ children }) => {

    // Hooks
    const shopify = useAppBridge();
    const intervalRef = useRef(null);
    const appInstanceRef = useRef(null);

    // State
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!shopify || !shopify.config || !shopify.config.apiKey || !shopify.config.host) {
            setError("App Bridge not initialized");
            setLoading(false);
            return;
        }

        if (!appInstanceRef.current) {
            appInstanceRef.current = createApp({
                apiKey: shopify.config.apiKey,
                host: shopify.config.host,
                forceRedirect: true,
            });
        }

        const app = appInstanceRef.current;
        let isInitialFetch = true;

        const fetchToken = async () => {
            try {
                setError(null);
                const sessionToken = await getSessionToken(app);
                setToken(sessionToken);
            } catch (err) {
                setError(err.message || "Failed to get session token");
                if (isInitialFetch) {
                    setToken(null);
                }
            } finally {
                if (isInitialFetch) {
                    setLoading(false);
                    isInitialFetch = false;
                }
            }
        };

        // Initial fetch
        fetchToken();

        // Refresh token every 50 minutes (tokens typically expire after 1 hour)
        intervalRef.current = setInterval(fetchToken, 50 * 60 * 1000);

        // Cleanup interval on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [shopify?.config?.apiKey, shopify?.config?.host]);

    if (loading) {
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Spinner accessibilityLabel="Small spinner example" size="small" />
        </div>;
    }

    if (error && !token) {
        return (
            <div>
                <p>Error: {error}</p>
                <p>Please refresh the page or contact support.</p>
            </div>
        );
    }

    return (
        <SessionTokenContext.Provider value={token}>
            {children}
        </SessionTokenContext.Provider>
    );
};

export const useSessionToken = () => useContext(SessionTokenContext);
