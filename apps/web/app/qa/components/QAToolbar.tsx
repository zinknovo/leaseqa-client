"use client";

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {FaCheck, FaPlus, FaSearch} from "react-icons/fa";
import {RootState} from "@/app/store";

type QAToolbarProps = {
    initialSearch?: string;
    onSearchChangeAction?: (value: string) => void;
    showResolved: boolean;
    onToggleResolvedAction: () => void;
};

export default function QAToolbar({
                                      initialSearch = "",
                                      onSearchChangeAction,
                                      showResolved,
                                      onToggleResolvedAction,
                                  }: QAToolbarProps) {
    const router = useRouter();
    const session = useSelector((state: RootState) => state.session);
    const isGuest = session.status === "guest";
    const [search, setSearch] = useState(initialSearch);

    const handleChange = (value: string) => {
        setSearch(value);
        onSearchChangeAction?.(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && search.trim()) {
            router.push(`/qa?search=${encodeURIComponent(search)}`);
        }
    };

    return (
        <div className="qa-toolbar">
            <div className="qa-toolbar-search">
                <FaSearch size={14} className="qa-toolbar-search-icon"/>
                <input
                    type="text"
                    placeholder="Search posts..."
                    value={search}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <button
                className={`qa-toolbar-btn ${showResolved ? "active" : "secondary"}`}
                onClick={onToggleResolvedAction}
            >
                <FaCheck size={12}/>
                <span>Resolved</span>
            </button>
            {!isGuest && (
                <button
                    className="qa-toolbar-btn primary"
                    onClick={() => router.push("/qa?compose=1")}
                >
                    <FaPlus size={12}/>
                    <span>New Post</span>
                </button>
            )}
        </div>
    );
}
