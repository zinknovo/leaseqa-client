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
        const buckets: Record<string, { label: string; items: Post[] }> = {
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
        return text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    };

    //TODO: shouldn't have unknown
    const getAuthor = (p: Post) => p.isAnonymous ? "Anonymous" : (p.author?.username || p.author?.email || "Unknown");
    const getAuthorInitial = (p: Post) => p.isAnonymous ? "?" : getAuthor(p).charAt(0).toUpperCase();
    //TODO: only show one folder?
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
                                {bucket.items.map((post) => {
                                    const isActive = post._id === currentPostId;
                                    return (
                                        <div
                                            key={post._id}
                                            className={`post-sidebar-item ${isActive ? "active" : ""} ${post.isResolved ? "resolved" : ""}`}
                                            onClick={() => onSelectPost(post._id)}
                                        >
                                            <div className="post-sidebar-item-title">
                                                {post.isResolved && <span className="resolved-badge">✓</span>}
                                                {post.summary}
                                            </div>
                                            <div className="post-sidebar-item-badges">
                                                <span className="post-sidebar-badge">
                                                    {post.createdAt ? format(new Date(post.createdAt), "MMM d") : ""}
                                                </span>
                                                {getFolder(post) && (
                                                    <span className="post-sidebar-badge">{getFolder(post)}</span>
                                                )}
                                            </div>
                                            <div className="post-sidebar-item-snippet">
                                                {makeSnippet(post.details || "")}
                                            </div>
                                            <div className="post-sidebar-item-author">
                                                <span
                                                    className={`icon-circle icon-circle-xs ${post.isAnonymous ? "icon-bg-muted" : "icon-bg-purple"}`}>
                                                    {getAuthorInitial(post)}
                                                </span>
                                                <span className="post-sidebar-item-author-name">
                                                    {getAuthor(post)}
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
