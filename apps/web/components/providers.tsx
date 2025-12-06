"use client";

import {ReactNode} from "react";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Provider as ReduxProvider} from "react-redux";

import store from "@/app/store";
import SessionLoader from "@/app/auth/SessionLoader";

const client = new QueryClient();

export function Providers({children}: {children: ReactNode}) {
    return (
        <ReduxProvider store={store}>
            <QueryClientProvider client={client}>
                <SessionLoader>
                    {children}
                </SessionLoader>
            </QueryClientProvider>
        </ReduxProvider>
    );
}
