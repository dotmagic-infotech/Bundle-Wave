import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60 * 1000,        // cache for 1 minute
            cacheTime: 5 * 60 * 1000,    // keep unused cache for 5 min
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});
