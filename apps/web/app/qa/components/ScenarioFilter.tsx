"use client";

import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import * as client from "@/app/qa/client";
import {Folder} from "../types";

export default function ScenarioFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeScenario = searchParams.get("scenario") || "all";
    const [folders, setFolders] = useState<Folder[]>([]);

    const loadFolders = async () => {
        try {
            const response = await client.fetchFolders();
            setFolders(response.data || []);
        } catch (error) {
            console.error("Failed to load folders:", error);
        }
    };

    useEffect(() => {
        loadFolders();
    }, []);

    const handleSelect = (value: string) => {
        if (value === "all") {
            router.push("/qa");
        } else {
            router.push(`/qa?scenario=${value}`);
        }
    };

    return (
        <div className="scenario-filter">
            <button
                className={`scenario-chip ${activeScenario === "all" ? "active" : ""}`}
                onClick={() => handleSelect("all")}
            >
                All
            </button>
            {folders.map((folder) => (
                <button
                    key={folder.name}
                    className={`scenario-chip ${activeScenario === folder.name ? "active" : ""}`}
                    onClick={() => handleSelect(folder.name)}
                >
                    {folder.displayName}
                </button>
            ))}
        </div>
    );
}
