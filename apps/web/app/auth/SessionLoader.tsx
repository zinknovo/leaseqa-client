"use client";

import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {setSession, signOut} from "@/app/store";
import * as client from "./client";

export default function SessionLoader({children}: { children: React.ReactNode }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const loadSession = async () => {
            try {
                const user = await client.fetchSession();
                if (user && typeof user === "object") {
                    dispatch(setSession(user));
                }
            } catch {
                dispatch(signOut());
            }
        };

        loadSession();
    }, [dispatch]);

    return <div>{children}</div>;
}
