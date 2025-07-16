import { useSessionToken } from "../Session/SessionTokenProvider";

export const useApiRequest = () => {

    // Hooks
    const token = useSessionToken();

    const apiRequest = async (url, method = "GET", body = null) => {
        try {
            const options = {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `token ${token}`,
                },
            };

            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(url, options);

            if (!response.ok) {
                return {
                    status: response.status,
                    data: null,
                    error: `HTTP Error: ${response.status} - ${response.statusText}`,
                };
            }

            const jsonResponse = await response.json();
            return { status: response.status, data: jsonResponse, error: null };
        } catch (error) {
            return { status: null, data: null, error: error.message };
        }
    };

    return apiRequest;
};
