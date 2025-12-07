import {FaChevronDown} from "react-icons/fa";
import {format} from "date-fns";

type Post = {
    _id: string;
    summary: string;
    folders?: string[];
    createdAt?: string;
};

type RecencySidebarProps = {
    posts: Post[];
    currentPostId: string;
    onSelectPost: (id: string) => void;
};

export default function RecencySidebar({posts, currentPostId, onSelectPost}: RecencySidebarProps) {
    const now = new Date();
    const thisWeekPosts = posts
        .filter((p) => {
            if (!p.createdAt) return false;
            const created = new Date(p.createdAt);
            const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
            return diffDays <= 6;
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        });

    if (!thisWeekPosts.length) return null;

    return (
        <div className="post-sidebar">
            <div className="post-sidebar-group">
                <div className="post-sidebar-header">
                    <FaChevronDown size={10}/>
                    <span>This Week</span>
                    <span className="post-sidebar-count">{thisWeekPosts.length}</span>
                </div>
                <div className="post-sidebar-items">
                    {thisWeekPosts.slice(0, 15).map((p) => {
                        const isActive = p._id === currentPostId;
                        return (
                            <div
                                key={p._id}
                                className={`post-sidebar-item ${isActive ? "active" : ""}`}
                                onClick={() => onSelectPost(p._id)}
                            >
                                <div className="post-sidebar-item-title">{p.summary}</div>
                                <div className="post-sidebar-item-meta">
                                    <span>{p.createdAt ? format(new Date(p.createdAt), "MMM d") : ""}</span>
                                    <span>{p.folders?.slice(0, 2).join(" · ")}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
