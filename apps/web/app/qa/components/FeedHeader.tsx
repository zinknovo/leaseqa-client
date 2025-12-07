import {useRouter} from "next/navigation";
import {FaFire} from "react-icons/fa";
import {Folder, Post} from "../types";
import {getFolderDisplayName} from "../utils";

type FeedHeaderProps = {
    folders: Folder[];
    posts: Post[];
    activeFolder: string | null;
    onSelectFolderAction: (folder: string | null) => void;
};

export default function FeedHeader({folders, posts}: FeedHeaderProps) {
    const router = useRouter();

    const hotPosts = posts
        .filter(p => p.urgency === "high" || (p.viewCount && p.viewCount > 50))
        .slice(0, 5);

    if (!hotPosts.length) return null;

    const handlePostClick = (postId: string) => {
        router.push(`/qa/${postId}`);
    };

    return (
        <div className="feed-header">
            <div className="feed-header-title">
                <FaFire size={16} className="feed-header-icon"/>
                <span>Hot Posts</span>
            </div>
            <div className="feed-header-posts">
                {hotPosts.map((post) => (
                    <div
                        key={post._id}
                        className="feed-header-post"
                        onClick={() => handlePostClick(post._id)}
                        style={{cursor: "pointer"}}
                    >
                        <div className="feed-header-post-top">
                            <span className="feed-header-post-title">{post.summary}</span>
                            <div className="feed-header-post-tags">
                                {post.folders.map(f => (
                                    <span key={f} className="feed-header-folder-badge">
                                        {getFolderDisplayName(folders, f)}
                                    </span>
                                ))}
                                {post.urgency && (
                                    <span className={`feed-header-urgency-badge ${post.urgency}`}>
                                        {post.urgency.toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="feed-header-post-snippet">
                            {post.details.replace(/<[^>]*>/g, "").slice(0, 120)}...
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
