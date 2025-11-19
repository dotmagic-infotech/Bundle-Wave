// React Imports
import { createContext, useState, useEffect } from "react";

// Custom Component
import { useSessionToken } from "../Session/SessionTokenProvider";

export const MetaContext = createContext();

export const DiscountProvider = ({ children }) => {
    // Hooks
    const token = useSessionToken();

    // State
    const [discountOptions, setDiscountOptions] = useState([]);
    const [metaData, setMetaData] = useState([]);
    const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);

    // First Time Call Api
    useEffect(() => {
        const fetchInitial = async () => {
            if (!token) return;

            try {
                const res = await fetch("https://bundle-wave-backend.xavierapps.com/api/metadata", {
                    headers: { Authorization: `token ${token}` },
                });
                const data = await res.json();
                setDiscountOptions(data?.discount_options);
                setMetaData(data?.metadata);
            } catch (err) {
                console.error("Error in initial metadata fetch:", err);
            }
        };

        fetchInitial();
    }, [token]);

    // If Plan Update After Call This Api
    useEffect(() => {
        const fetchAfterSubscribe = async () => {
            if (!token || !isSubscriptionActive) return;

            try {
                const res = await fetch("https://bundle-wave-backend.xavierapps.com/api/metadata", {
                    headers: { Authorization: `token ${token}` },
                });
                const data = await res.json();
                setDiscountOptions(data?.discount_options);
                setMetaData(data?.metadata);
            } catch (err) {
                console.error("Error in subscription metadata fetch:", err);
            }
        };

        fetchAfterSubscribe();
    }, [token, isSubscriptionActive]);

    return (
        <MetaContext.Provider value={{ discountOptions, metaData, isSubscriptionActive, setIsSubscriptionActive }}>
            {children}
        </MetaContext.Provider>
    );
};
