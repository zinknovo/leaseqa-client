"use client";

import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {setSession, signOut} from "@/app/store";
import * as client from "./client";

export default function SessionLoader({children}: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const loadSession = async () => {
            try {
                const user = await client.fetchSession();
                if (user && typeof user === "object") {
                    dispatch(setSession((user as any).data || user));
                }
            } catch {
                dispatch(signOut());
            } finally {
                setReady(true);
            }
        };

        loadSession();
    }, [dispatch]);

    if (!ready) {
        // Avoid rendering gated pages before session is resolved to prevent premature redirects
        return null;
    }

    return <div>{children}</div>;
}
