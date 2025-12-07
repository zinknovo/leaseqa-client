import {FaChevronDown, FaChevronRight} from "react-icons/fa";
import {format} from "date-fns";
import {useMemo} from "react";
import {Post, RecencySidebarProps} from "../types";

export default function RecencySidebar({
    posts,
    currentPostId,
    onSelectPost,
    folderDisplayMap = {},
    bucketOpen,
    onToggleBucket,
}: RecencySidebarProps) {
    const grouped = useMemo(() => {
        const now = new Date();
        const buckets: Record<string, {label: string; items: Post[]}> = {
            thisWeek: {label: "This week", items: []},
            lastWeek: {label: "Last week", items: []},
            thisMonth: {label: "Earlier this month", items: []},
            earlier: {label: "Earlier", items: []},
        };

        const sorted = [...posts].sort((a, b) => {
            const da = new Date(a.createdAt || a.updatedAt || 0).getTime();
            const db = new Date(b.createdAt || b.updatedAt || 0).getTime();
            return db - da;
        });

        sorted.forEach((p) => {
            const created = new Date(p.createdAt || 0);
            const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays <= 6) buckets.thisWeek.items.push(p);
            else if (diffDays <= 13) buckets.lastWeek.items.push(p);
            else if (diffDays <= 30) buckets.thisMonth.items.push(p);
            else buckets.earlier.items.push(p);
        });

        return buckets;
    }, [posts]);

    const hasAny = Object.values(grouped).some((b) => b.items.length);
    if (!hasAny) return null;

    const makeSnippet = (text: string) => {
        if (!text) return "";
        const clean = text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        return clean;
    };

    const getAuthor = (p: Post) => p.author?.username || p.author?.email || "Anonymous";
    const getAuthorInitial = (p: Post) => getAuthor(p).charAt(0).toUpperCase();
    const getRole = (p: Post) => p.author?.role || "tenant";
    const getFolder = (p: Post) => {
        const key = p.folders?.[0];
        return key ? folderDisplayMap[key] || key : "";
    };

    return (
        <div className="post-sidebar">
            {Object.entries(grouped).map(([key, bucket]) => {
                if (!bucket.items.length) return null;
                const isOpen = bucketOpen[key] ?? true;
                return (
                    <div className="post-sidebar-group" key={key}>
                        <button
                            type="button"
                            className="post-sidebar-header"
                            onClick={() => onToggleBucket(key)}
                        >
                            {isOpen ? <FaChevronDown size={10}/> : <FaChevronRight size={10}/>}
                            <span>{bucket.label}</span>
                            <span className="post-sidebar-count">{bucket.items.length}</span>
                        </button>
                        {isOpen && (
                            <div className="post-sidebar-items">
                                {bucket.items.map((p) => {
                                    const isActive = p._id === currentPostId;
                                    const role = getRole(p);
                                    return (
                                        <div
                                            key={p._id}
                                            className={`post-sidebar-item ${isActive ? "active" : ""}`}
                                            onClick={() => onSelectPost(p._id)}
                                        >
                                            <div className="post-sidebar-item-title">{p.summary}</div>
                                            <div className="post-sidebar-item-badges">
                                                <span className={`role-tag-${role}`}>{role}</span>
                                                <span className="post-sidebar-badge">
                                                    {p.createdAt ? format(new Date(p.createdAt), "MMM d") : ""}
                                                </span>
                                                {getFolder(p) && (
                                                    <span className="post-sidebar-badge">{getFolder(p)}</span>
                                                )}
                                            </div>
                                            <div className="post-sidebar-item-snippet">
                                                {makeSnippet(p.details || "")}
                                            </div>
                                            <div className="post-sidebar-item-author">
                                                <span className="icon-circle icon-circle-xs icon-bg-purple">
                                                    {getAuthorInitial(p)}
                                                </span>
                                                <span className="post-sidebar-item-author-name">
                                                    {getAuthor(p)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
