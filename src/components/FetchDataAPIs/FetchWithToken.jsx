// Custom Component
import { useSessionToken } from '../Session/SessionTokenProvider';

export const useFetchWithToken = () => {

    // Hooks
    const token = useSessionToken();

    const fetchWithToken = async ({ url, method = 'GET', body = null, isFormData = false }) => {
        if (!token) {
            shopify.toast.show("Unauthorized Access");
            return;
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
            const error = await response.text();
            // console.log("error-->", error)
        }

        return await response.json();
    };

    return fetchWithToken;
};
