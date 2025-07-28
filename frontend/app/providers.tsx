'use client';
// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import React, { useState, useEffect, lazy, Suspense, ReactNode } from 'react';
import {
    isServer,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000,
                refetchOnWindowFocus: true,
                refetchOnMount: (query) => {
                    return query.state.status === 'error';
                },
            },
        },
    });
}

const ReactQueryDevtoolsProduction = lazy(() =>
    import('@tanstack/react-query-devtools/build/modern/production.js').then(
        (d) => ({
            default: d.ReactQueryDevtools,
        })
    )
);

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (isServer) {
        // Server: always make a new query client
        return makeQueryClient();
    } else {
        // Browser: make a new query client if we don't already have one
        // This is very important, so we don't re-make a new client if React
        // suspends during the initial render. This may not be needed if we
        // have a suspense boundary BELOW the creation of the query client
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}

export default function Providers({ children }: { children: ReactNode; }) {
    const [showDevtools, setShowDevtools] = useState(
        process.env.NODE_ENV === 'development'
    );
    // NOTE: Avoid useState when initializing the query client if you don't
    //       have a suspense boundary between this and the code that may
    //       suspend because React will throw away the client on the initial
    //       render if it suspends and there is no boundary
    const queryClient = getQueryClient();

    useEffect(() => {
        // @ts-expect-error: toggleDevtools is used only for TanStack devtools in dev mode
        window.toggleDevtools = () => setShowDevtools((old) => !old);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {showDevtools && (
                <Suspense fallback={null}>
                    <ReactQueryDevtoolsProduction />
                </Suspense>
            )}
        </QueryClientProvider>
    );
}
