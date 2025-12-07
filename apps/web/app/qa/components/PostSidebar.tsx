import {FaChevronDown, FaChevronRight} from "react-icons/fa";
import {format} from "date-fns";
import {Post} from "../types";

type PostSidebarProps = {
    groupedPosts: Record<string, {label: string; items: Post[]}>;
    bucketOpen: Record<string, boolean>;
    selectedId: string | null;
    currentRouteId: string | null;
    onToggleBucket: (key: string) => void;
    onSelectPost: (post: Post) => void;
    folderDisplayMap: Record<string, string>;
};

export default function PostSidebar({
    groupedPosts,
    bucketOpen,
    selectedId,
    currentRouteId,
    onToggleBucket,
    onSelectPost,
    folderDisplayMap,
}: PostSidebarProps) {
    const formatTimestamp = (date: any) => {
        if (!date) return "—";
        try {
            return format(new Date(date), "MMM d");
        } catch {
            return "—";
        }
    };

    const makeSnippet = (text: string) => {
        if (!text) return "";
        const clean = text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        return clean;
    };

    const getAuthorName = (post: Post) =>
        post.author?.username || post.author?.email || "Anonymous";
    const getAuthorRole = (post: Post) => post.author?.role || "tenant";
    const getFolder = (post: Post) => {
        const key = post.folders?.[0];
        return key ? (folderDisplayMap[key] || key) : "";
    };

    const hasAnyPosts = Object.values(groupedPosts).some(bucket => bucket.items.length > 0);

    if (!hasAnyPosts) {
        return null;
    }

    return (
        <div className="post-sidebar">
            {Object.entries(groupedPosts).map(([key, bucket]) => {
                if (!bucket.items.length) return null;
                const open = bucketOpen[key] ?? true;

                return (
                    <div key={key} className="post-sidebar-group">
                        <button
                            type="button"
                            className="post-sidebar-header"
                            onClick={() => onToggleBucket(key)}
                        >
                            {open ? <FaChevronDown size={10}/> : <FaChevronRight size={10}/>}
                            <span>{bucket.label}</span>
                            <span className="post-sidebar-count">{bucket.items.length}</span>
                        </button>

                        {open && (
                            <div className="post-sidebar-items">
                                {bucket.items.map((post) => {
                                    const isSelected = selectedId === post._id || currentRouteId === post._id;
                                    return (
                                        <div
                                            key={post._id}
                                            className={`post-sidebar-item ${isSelected ? "active" : ""}`}
                                            onClick={() => onSelectPost(post)}
                                        >
                                            <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                                                <div className="post-sidebar-item-title">{post.summary}</div>
                                                <div className="d-flex gap-1 flex-wrap justify-content-end text-uppercase" style={{fontSize: "0.65rem"}}>
                                                    <span className="badge rounded-pill bg-light text-secondary border">
                                                        {getAuthorRole(post)}
                                                    </span>
                                                    <span className="badge rounded-pill bg-light text-secondary border">
                                                        {formatTimestamp(post.createdAt)}
                                                    </span>
                                                    {getFolder(post) && (
                                                        <span className="badge rounded-pill bg-light text-secondary border text-capitalize">
                                                            {getFolder(post)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div
                                                className="post-sidebar-item-snippet"
                                                style={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {makeSnippet(post.details)}
                                            </div>
                                            <div className="post-sidebar-item-meta text-secondary small text-truncate">
                                                {getAuthorName(post)}
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
