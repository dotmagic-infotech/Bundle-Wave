// React Imports
import { createContext, useEffect, useState } from "react";

// Custom Component
import { getCurrencySymbol } from "../../assets/currencyUtils";
import { useAppBridge } from "@shopify/app-bridge-react";

export const ShopifyContext = createContext();

export const ShopifyProvider = ({ children }) => {

    // Hooks
    const shopify = useAppBridge();

    // State
    const [shopName, setShopName] = useState("anuj-vadi01.myshopify.com");
    const [currencyCode, setCurrencyCode] = useState("USD");
    const [currencySymbol, setCurrencySymbol] = useState("$");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const shop = params.get("shop");

        if (shop) {
            setShopName(shop || shopify.config.shop);
        }

        // console.log("shop->", shop);

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
