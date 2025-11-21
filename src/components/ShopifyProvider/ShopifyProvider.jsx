// React Imports
import { createContext, useContext, useEffect, useState } from "react";

// Custom Component
import { getCurrencySymbol } from "../../assets/currencyUtils";
import { useAppBridge } from "@shopify/app-bridge-react";
import { MetaContext } from "../MetaDataContext/MetaDataProvider";

export const ShopifyContext = createContext();

export const ShopifyProvider = ({ children }) => {

    // Hooks
    const { metaData } = useContext(MetaContext);

    // State
    const [shopName, setShopName] = useState("");
    const [currencyCode, setCurrencyCode] = useState("USD");
    const [currencySymbol, setCurrencySymbol] = useState("$");

    useEffect(() => {
        let resolved = false;

        // 1) PRIMARY: Backend metadata
        if (metaData?.shop) {
            setShopName(metaData.shop);
            resolved = true;
        }

        // 2) SECONDARY: URL fallback (only if metadata missing)
        if (!resolved) {
            const params = new URLSearchParams(window.location.search);
            const urlShop = params.get("shop");

            if (urlShop) {
                setShopName(urlShop);
                resolved = true;
            }
        }

    }, [metaData]);

    useEffect(() => {
        const currency = window.shopCurrency || "INR";
        setCurrencyCode(currency);
        setCurrencySymbol(getCurrencySymbol(currency));
    }, []);

    return (
        <ShopifyContext.Provider value={{ shopName, currencyCode, currencySymbol }}>
            {children}
        </ShopifyContext.Provider>
    );
};
