// Custom Component
import { useSessionToken } from '../Session/SessionTokenProvider';
import { useAppBridge } from '@shopify/app-bridge-react';

export const useFetchWithToken = () => {

    // Hooks
    const token = useSessionToken();
    const shopify = useAppBridge();

    const fetchWithToken = async ({ url, method = 'GET', body = null, isFormData = false }) => {
        if (!token) {
            if (shopify?.toast) {
                shopify.toast.show("Unauthorized Access", { isError: true });
            }
            throw new Error("Unauthorized Access");
        }

        const headers = {
            Authorization: `token ${token}`,
        };

        if (!isFormData && body && method !== 'GET') {
            headers['Content-Type'] = 'application/json';
        }

        const options = {
            method,
            headers,
        };

        if (method !== 'GET' && body) {
            options.body = isFormData ? body : JSON.stringify(body);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { message: errorText || `HTTP Error: ${response.status}` };
            }
            
            if (shopify?.toast) {
                shopify.toast.show(errorData.message || "Request failed", { 
                    isError: true,
                    duration: 5000 
                });
            }
            
            throw new Error(errorData.message || `HTTP Error: ${response.status}`);
        }

        return await response.json();
    };

    return fetchWithToken;
};
