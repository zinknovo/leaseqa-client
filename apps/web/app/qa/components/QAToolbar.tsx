"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {FaCheck, FaPlus, FaSearch} from "react-icons/fa";

type QAToolbarProps = {
    initialSearch?: string;
    onSearchChange?: (value: string) => void;
    showResolved: boolean;
    onToggleResolved: () => void;
};

export default function QAToolbar({
    initialSearch = "",
    onSearchChange,
    showResolved,
    onToggleResolved,
}: QAToolbarProps) {
    const router = useRouter();
    const [search, setSearch] = useState(initialSearch);

    const handleChange = (value: string) => {
        setSearch(value);
        onSearchChange?.(value);
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
                onClick={onToggleResolved}
            >
                <FaCheck size={12}/>
                <span>Resolved</span>
            </button>
            <button
                className="qa-toolbar-btn primary"
                onClick={() => router.push("/qa?compose=1")}
            >
                <FaPlus size={12}/>
                <span>New Post</span>
            </button>
        </div>
    );
}
