"use client";

import {usePathname, useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {FaBook, FaChartBar, FaCog, FaComments} from "react-icons/fa";
import {RootState} from "@/app/store";

const TABS = [
    {key: "qa", label: "Q&A", icon: FaComments, path: "/qa"},
    {key: "resources", label: "Resources", icon: FaBook, path: "/qa/resources"},
    {key: "stats", label: "Stats", icon: FaChartBar, path: "/qa/stats"},
];

export default function NavTabs() {
    const router = useRouter();
    const pathname = usePathname();
    const session = useSelector((state: RootState) => state.session);
    const isAdmin = session.user?.role === "admin";

    const allTabs = isAdmin
        ? [...TABS, {key: "manage", label: "Manage", icon: FaCog, path: "/qa/manage"}]
        : TABS;

    const getActiveTab = () => {
        if (pathname?.startsWith("/qa/manage")) return "manage";
        if (pathname?.startsWith("/qa/stats")) return "stats";
        if (pathname?.startsWith("/qa/resources")) return "resources";
        return "qa";
    };

    const activeTab = getActiveTab();

    return (
        <div className="qa-nav-tabs">
            {allTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                    <button
                        key={tab.key}
                        className={`qa-nav-tab ${isActive ? "active" : ""}`}
                        onClick={() => router.push(tab.path)}
                    >
                        <Icon size={14}/>
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
